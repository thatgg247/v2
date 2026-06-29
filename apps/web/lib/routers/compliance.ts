import { router, protectedProcedure } from "@/lib/trpc";
import { z } from "zod";
import { ComplianceStatus, ComplianceFramework } from "@seriesos/db";
import { generateComplianceAdvisory } from "@seriesos/ai";

export const complianceRouter = router({
  getRequirements: protectedProcedure
    .input(z.object({ companyId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.complianceRequirement.findMany({
        where: { companyId: input.companyId },
        orderBy: [{ priority: "asc" }, { framework: "asc" }],
      });
    }),

  updateStatus: protectedProcedure
    .input(z.object({
      id: z.string(),
      status: z.nativeEnum(ComplianceStatus),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.complianceRequirement.update({
        where: { id: input.id },
        data: { status: input.status, completedAt: input.status === ComplianceStatus.COMPLETE ? new Date() : null },
      });
    }),

  getAIAdvisor: protectedProcedure
    .input(z.object({ companyId: z.string(), framework: z.nativeEnum(ComplianceFramework) }))
    .mutation(async ({ ctx, input }) => {
      const company = await ctx.prisma.company.findFirstOrThrow({
        where: { id: input.companyId, organizationId: ctx.session.user.organizationId },
      });
      const advisory = await generateComplianceAdvisory({
        companyId: input.companyId,
        userId: ctx.session.user.id,
        framework: input.framework,
        company: {
          name: company.name,
          industry: company.industry,
          stage: company.stage,
          description: company.description,
        },
      });
      return { advisory };
    }),
});
