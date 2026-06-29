import { router, protectedProcedure } from "@/lib/trpc";
import { z } from "zod";
import { generateOutreachEmail, classifyInvestorReply, scorePitch, prepInvestorCall } from "@seriesos/ai";
import { TRPCError } from "@trpc/server";

async function checkAICredits(ctx: any) {
  const sub = await ctx.prisma.subscription.findUnique({ where: { organizationId: ctx.session.user.organizationId } });
  if (!sub) return;
  if (sub.aiCreditsUsed >= sub.aiCreditsIncluded) {
    throw new TRPCError({ code: "FORBIDDEN", message: "AI credit limit reached. Upgrade your plan or purchase more credits." });
  }
}

export const aiRouter = router({
  generateEmail: protectedProcedure
    .input(z.object({
      companyId: z.string(),
      investorName: z.string(),
      investorFirm: z.string(),
      investorFocus: z.string(),
      sequenceStage: z.number().min(1).max(5),
      deckUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await checkAICredits(ctx);
      const company = await ctx.prisma.company.findFirstOrThrow({
        where: { id: input.companyId, organizationId: ctx.session.user.organizationId },
      });
      const email = await generateOutreachEmail({
        ...input, userId: ctx.session.user.id,
        company: { name: company.name, industry: company.industry, stage: company.stage, description: company.description, traction: company.traction, targetRaise: company.targetRaise },
      });
      await ctx.prisma.subscription.updateMany({
        where: { organizationId: ctx.session.user.organizationId },
        data: { aiCreditsUsed: { increment: 1 } },
      });
      return { email };
    }),

  classifyReply: protectedProcedure
    .input(z.object({ companyId: z.string(), replyText: z.string().min(1).max(5000) }))
    .mutation(async ({ ctx, input }) => {
      await checkAICredits(ctx);
      const result = await classifyInvestorReply({ ...input, userId: ctx.session.user.id });
      return result;
    }),

  scorePitch: protectedProcedure
    .input(z.object({ companyId: z.string(), pitchText: z.string().min(50).max(10000) }))
    .mutation(async ({ ctx, input }) => {
      await checkAICredits(ctx);
      const score = await scorePitch({ ...input, userId: ctx.session.user.id });
      return { score };
    }),

  prepCall: protectedProcedure
    .input(z.object({
      companyId: z.string(),
      investorName: z.string(),
      investorFirm: z.string(),
      investorThesis: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await checkAICredits(ctx);
      const company = await ctx.prisma.company.findFirstOrThrow({
        where: { id: input.companyId, organizationId: ctx.session.user.organizationId },
      });
      const prep = await prepInvestorCall({
        ...input, userId: ctx.session.user.id,
        company: { name: company.name, industry: company.industry, stage: company.stage, traction: company.traction },
      });
      return { prep };
    }),
});
