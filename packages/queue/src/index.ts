// ─────────────────────────────────────────────────────────────────────────────
// @seriesos/queue — BullMQ job queue definitions
// All async work (AI, email, compliance, readiness) runs through queues.
// ─────────────────────────────────────────────────────────────────────────────

import { Queue, Worker, QueueEvents, Job } from "bullmq";
import IORedis from "ioredis";

// Redis connection (Upstash in production, local Redis in development)
const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null, // Required for BullMQ
  enableReadyCheck: false,
});

// ── Queue definitions ─────────────────────────────────────────────────────────

const DEFAULT_JOB_OPTIONS = {
  attempts: 3,
  backoff: { type: "exponential" as const, delay: 5000 },
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 50 },
};

export const aiQueue = new Queue("ai-generation", { connection, defaultJobOptions: DEFAULT_JOB_OPTIONS });
export const emailQueue = new Queue("email-send", { connection, defaultJobOptions: DEFAULT_JOB_OPTIONS });
export const complianceQueue = new Queue("compliance-scan", { connection, defaultJobOptions: DEFAULT_JOB_OPTIONS });
export const readinessQueue = new Queue("readiness-engine", { connection, defaultJobOptions: DEFAULT_JOB_OPTIONS });
export const grantSyncQueue = new Queue("grant-sync", { connection, defaultJobOptions: DEFAULT_JOB_OPTIONS });
export const notificationQueue = new Queue("notification-dispatch", { connection, defaultJobOptions: DEFAULT_JOB_OPTIONS });
export const billingQueue = new Queue("billing-reconcile", { connection, defaultJobOptions: DEFAULT_JOB_OPTIONS });
export const dataRoomQueue = new Queue("data-room-process", { connection, defaultJobOptions: DEFAULT_JOB_OPTIONS });

// ── Job type interfaces ───────────────────────────────────────────────────────

export interface AIJobData {
  type: "generateEmail" | "classifyReply" | "scorePitch" | "prepCall" | "generateDocument" | "complianceAdvisory";
  companyId: string;
  userId: string;
  payload: Record<string, unknown>;
}

export interface EmailJobData {
  type: "outreach" | "transactional" | "notification" | "investorUpdate";
  to: string;
  subject: string;
  body: string;
  companyId?: string;
  recipientName?: string;
  recipientFirm?: string;
  sequenceStage?: number;
  matchScore?: number;
}

export interface ComplianceJobData {
  companyId: string;
  trigger: "profile_update" | "manual" | "scheduled";
}

export interface ReadinessJobData {
  companyId: string;
  trigger: "profile_update" | "item_complete" | "document_upload";
}

export interface NotificationJobData {
  userId: string;
  type: string;
  title: string;
  body: string;
  actionUrl?: string;
  sendEmail: boolean;
}

export interface BillingJobData {
  organizationId: string;
  eventType: string;
  quantity: number;
  unitCostUsd: number;
  metadata?: Record<string, unknown>;
}

// ── Queue helpers ─────────────────────────────────────────────────────────────

export async function enqueueAIJob(data: AIJobData): Promise<Job> {
  return aiQueue.add(data.type, data, { priority: 1 });
}

export async function enqueueEmailJob(data: EmailJobData): Promise<Job> {
  return emailQueue.add(data.type, data);
}

export async function enqueueComplianceScan(data: ComplianceJobData): Promise<Job> {
  return complianceQueue.add("evaluate", data, { delay: 2000 }); // 2s delay to batch profile updates
}

export async function enqueueReadinessRecalc(data: ReadinessJobData): Promise<Job> {
  return readinessQueue.add("recalculate", data, { delay: 1000 });
}

export async function enqueueNotification(data: NotificationJobData): Promise<Job> {
  return notificationQueue.add("dispatch", data);
}

export async function enqueueBillingEvent(data: BillingJobData): Promise<Job> {
  return billingQueue.add("record", data);
}

export { connection };
