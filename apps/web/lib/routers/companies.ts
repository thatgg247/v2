import { router, protectedProcedure } from "@/lib/trpc";
import { z } from "zod";
import { Industry, CompanyStage } from "@seriesos/db";
import { enqueueReadinessRecalc, enqueueComplianceScan } from "@seriesos/queue";

export const companiesRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.company.findMany({
      where: { organizationId: ctx.session.user.organizationId },
      include: { readinessScore: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.company.findFirstOrThrow({
        where: { id: input.id, organizationId: ctx.session.user.organizationId },
        include: { readinessScore: true, readinessPortals: true, dataRoom: true },
      });
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(200),
      industry: z.nativeEnum(Industry).optional(),
      stage: z.nativeEnum(CompanyStage).optional(),
      targetRaise: z.string().optional(),
      description: z.string().max(2000).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const company = await ctx.prisma.company.create({
        data: { ...input, organizationId: ctx.session.user.organizationId },
      });
      // Initialize readiness score and data room
      await ctx.prisma.readinessScore.create({ data: { companyId: company.id } });
      await ctx.prisma.dataRoom.create({ data: { companyId: company.id } });
      // Enqueue readiness + compliance calculation
      await enqueueReadinessRecalc({ companyId: company.id, trigger: "profile_update" });
      return company;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).max(200).optional(),
      industry: z.nativeEnum(Industry).optional(),
      stage: z.nativeEnum(CompanyStage).optional(),
      targetRaise: z.string().optional(),
      description: z.string().max(2000).optional(),
      problem: z.string().max(2000).optional(),
      solution: z.string().max(2000).optional(),
      traction: z.string().max(2000).optional(),
      useOfFunds: z.string().max(2000).optional(),
      websiteUrl: z.string().url().optional().or(z.literal("")),
      pitchDeckUrl: z.string().url().optional().or(z.literal("")),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const company = await ctx.prisma.company.updateMany({
        where: { id, organizationId: ctx.session.user.organizationId },
        data,
      });
      // Re-run readiness and compliance engines on profile update
      await enqueueReadinessRecalc({ companyId: id, trigger: "profile_update" });
      await enqueueComplianceScan({ companyId: id, trigger: "profile_update" });
      return company;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.company.deleteMany({
        where: { id: input.id, organizationId: ctx.session.user.organizationId },
      });
    }),
});
