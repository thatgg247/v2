import { router, protectedProcedure } from "@/lib/trpc";
import { z } from "zod";
import { PipelineContactType, PipelineStage } from "@seriesos/db";

export const pipelineRouter = router({
  list: protectedProcedure
    .input(z.object({ companyId: z.string(), contactType: z.nativeEnum(PipelineContactType).optional() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.pipeline.findMany({
        where: { companyId: input.companyId, ...(input.contactType && { contactType: input.contactType }) },
        include: { investor: true, grant: true },
        orderBy: { addedAt: "desc" },
      });
    }),

  add: protectedProcedure
    .input(z.object({
      companyId: z.string(),
      contactType: z.nativeEnum(PipelineContactType),
      contactName: z.string(),
      contactFirm: z.string().optional(),
      contactEmail: z.string().email().optional(),
      investorId: z.string().optional(),
      grantId: z.string().optional(),
      notes: z.string().optional(),
      matchScore: z.number().min(0).max(100).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.pipeline.create({ data: input });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      stage: z.nativeEnum(PipelineStage).optional(),
      notes: z.string().optional(),
      nextFollowUp: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.pipeline.update({ where: { id }, data });
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.pipeline.delete({ where: { id: input.id } });
    }),
});
