import { router, protectedProcedure } from "@/lib/trpc";
import { z } from "zod";

export const readinessRouter = router({
  getScore: protectedProcedure
    .input(z.object({ companyId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.readinessScore.findUnique({ where: { companyId: input.companyId } });
    }),

  getPortals: protectedProcedure
    .input(z.object({ companyId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.readinessPortal.findMany({
        where: { companyId: input.companyId },
        orderBy: { portalType: "asc" },
      });
    }),

  getRoadmap: protectedProcedure
    .input(z.object({ companyId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [company, score, portals, compliance] = await Promise.all([
        ctx.prisma.company.findFirstOrThrow({ where: { id: input.companyId, organizationId: ctx.session.user.organizationId } }),
        ctx.prisma.readinessScore.findUnique({ where: { companyId: input.companyId } }),
        ctx.prisma.readinessPortal.findMany({ where: { companyId: input.companyId } }),
        ctx.prisma.complianceRequirement.findMany({ where: { companyId: input.companyId }, orderBy: { priority: "asc" } }),
      ]);
      return { company, score, portals, compliance };
    }),
});
