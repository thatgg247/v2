// ─────────────────────────────────────────────────────────────────────────────
// @seriesos/ai — Server-side Claude AI service
// Series OS owns the API key. Users never see or manage it.
// All calls are metered and logged to the ai_outputs table.
// ─────────────────────────────────────────────────────────────────────────────

import Anthropic from "@anthropic-ai/sdk";
import { prisma, AIOutputType } from "@seriesos/db";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Model to use — Haiku for fast/cheap, Sonnet for quality
const DEFAULT_MODEL = "claude-3-haiku-20240307";
const QUALITY_MODEL  = "claude-3-5-sonnet-20241022";

// Cost per 1K tokens (USD) — approximate
const COST_PER_1K_INPUT  = 0.00025;
const COST_PER_1K_OUTPUT = 0.00125;

interface AICallOptions {
  companyId: string;
  userId: string;
  outputType: AIOutputType;
  systemPrompt: string;
  userPrompt: string;
  useQualityModel?: boolean;
  maxTokens?: number;
}

export async function callClaude(opts: AICallOptions): Promise<string> {
  const model = opts.useQualityModel ? QUALITY_MODEL : DEFAULT_MODEL;

  const response = await anthropic.messages.create({
    model,
    max_tokens: opts.maxTokens ?? 1024,
    system: opts.systemPrompt,
    messages: [{ role: "user", content: opts.userPrompt }],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type from Claude");

  const inputTokens  = response.usage.input_tokens;
  const outputTokens = response.usage.output_tokens;
  const totalTokens  = inputTokens + outputTokens;
  const costUsd      = (inputTokens / 1000) * COST_PER_1K_INPUT + (outputTokens / 1000) * COST_PER_1K_OUTPUT;

  // Log to database for metering and audit
  await prisma.aIOutput.create({
    data: {
      companyId:  opts.companyId,
      userId:     opts.userId,
      outputType: opts.outputType,
      prompt:     opts.userPrompt,
      response:   content.text,
      tokensUsed: totalTokens,
      modelUsed:  model,
      costUsd,
    },
  });

  return content.text;
}

// ── PROMPT TEMPLATES ─────────────────────────────────────────────────────────

export interface CompanyContext {
  name: string;
  industry: string;
  stage: string;
  description?: string | null;
  problem?: string | null;
  solution?: string | null;
  traction?: string | null;
  useOfFunds?: string | null;
  targetRaise?: string | null;
}

export async function generateOutreachEmail(opts: {
  companyId: string;
  userId: string;
  company: CompanyContext;
  investorName: string;
  investorFirm: string;
  investorFocus: string;
  sequenceStage: number;
  deckUrl?: string;
}): Promise<string> {
  const stageLabels: Record<number, string> = {
    1: "cold introduction",
    2: "follow-up",
    3: "send the deck",
    4: "second follow-up",
    5: "request a meeting",
  };

  return callClaude({
    companyId:  opts.companyId,
    userId:     opts.userId,
    outputType: AIOutputType.EMAIL_COLD_INTRO,
    systemPrompt: `You are an expert startup fundraising advisor. Write concise, personalized investor outreach emails. 
Keep emails under 200 words. Be specific, not generic. Never use placeholders. 
Focus on why THIS investor is a good fit for THIS company.`,
    userPrompt: `Write a ${stageLabels[opts.sequenceStage] || "follow-up"} email from the founder of ${opts.company.name} to ${opts.investorName} at ${opts.investorFirm}.

Company: ${opts.company.name}
Industry: ${opts.company.industry}
Stage: ${opts.company.stage}
Raise: ${opts.company.targetRaise ?? "not specified"}
Description: ${opts.company.description ?? ""}
Traction: ${opts.company.traction ?? ""}
Investor focus: ${opts.investorFocus}
${opts.deckUrl ? `Deck: ${opts.deckUrl}` : ""}

Write only the email body (no subject line). Be warm, specific, and concise.`,
  });
}

export async function classifyInvestorReply(opts: {
  companyId: string;
  userId: string;
  replyText: string;
}): Promise<{ intent: string; nextStep: string; confidence: string }> {
  const result = await callClaude({
    companyId:  opts.companyId,
    userId:     opts.userId,
    outputType: AIOutputType.REPLY_CLASSIFY,
    systemPrompt: `You are an expert at reading investor signals. Classify investor email replies and suggest next steps. 
Always respond with valid JSON only.`,
    userPrompt: `Classify this investor reply and suggest a next step.

Reply: "${opts.replyText}"

Respond with JSON: { "intent": "INTERESTED|MAYBE|PASS|MEETING_REQUEST|MORE_INFO|GHOSTING", "nextStep": "one specific action to take", "confidence": "HIGH|MEDIUM|LOW" }`,
  });

  try { return JSON.parse(result); }
  catch { return { intent: "UNCLEAR", nextStep: "Follow up in 5 business days", confidence: "LOW" }; }
}

export async function scorePitch(opts: {
  companyId: string;
  userId: string;
  pitchText: string;
}): Promise<string> {
  return callClaude({
    companyId:  opts.companyId,
    userId:     opts.userId,
    outputType: AIOutputType.PITCH_SCORE,
    useQualityModel: true,
    maxTokens: 2048,
    systemPrompt: `You are a venture capitalist with 20 years of experience evaluating pitches. 
Score startup pitches across 9 criteria and provide specific, actionable feedback.`,
    userPrompt: `Score this pitch across 9 criteria (each 1-10) and give specific improvement suggestions.

Pitch: ${opts.pitchText}

Criteria: Problem Clarity, Solution Strength, Market Size, Traction/Validation, Team, Business Model, Competition Awareness, Financial Projections, Fundraising Ask

Format: For each criterion give the score and 1-2 sentences of specific feedback. End with an overall score and top 3 priorities to improve.`,
  });
}

export async function generateComplianceAdvisory(opts: {
  companyId: string;
  userId: string;
  framework: string;
  company: CompanyContext;
}): Promise<string> {
  return callClaude({
    companyId:  opts.companyId,
    userId:     opts.userId,
    outputType: AIOutputType.COMPLIANCE_ADVISOR,
    useQualityModel: true,
    maxTokens: 1500,
    systemPrompt: `You are a compliance expert helping startups understand regulatory requirements. 
Be specific, practical, and actionable. Tailor advice to the company's stage and industry.`,
    userPrompt: `Explain ${opts.framework} compliance requirements for this company:

Company: ${opts.company.name}
Industry: ${opts.company.industry}
Stage: ${opts.company.stage}
Description: ${opts.company.description ?? ""}

Provide: (1) Why this applies to them specifically, (2) Estimated cost range, (3) Estimated timeline, (4) First 3 concrete actions to take this month.`,
  });
}

export async function prepInvestorCall(opts: {
  companyId: string;
  userId: string;
  company: CompanyContext;
  investorName: string;
  investorFirm: string;
  investorThesis: string;
}): Promise<string> {
  return callClaude({
    companyId:  opts.companyId,
    userId:     opts.userId,
    outputType: AIOutputType.CALL_PREP,
    useQualityModel: true,
    maxTokens: 1500,
    systemPrompt: `You are a fundraising coach preparing founders for investor meetings. Give sharp, specific preparation materials.`,
    userPrompt: `Prepare call notes for a meeting between ${opts.company.name} and ${opts.investorName} at ${opts.investorFirm}.

Investor thesis: ${opts.investorThesis}
Company stage: ${opts.company.stage}
Traction: ${opts.company.traction ?? "Not specified"}

Provide: (1) 3 likely questions they'll ask and suggested answers, (2) 2 things to emphasize given their thesis, (3) 1 potential objection and how to handle it, (4) A strong opening line.`,
  });
}
