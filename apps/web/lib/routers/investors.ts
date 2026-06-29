import { router, protectedProcedure } from "@/lib/trpc";
import { z } from "zod";

export const investorsRouter = router({
  search: protectedProcedure
    .input(z.object({
      query: z.string().optional(),
      stage: z.string().optional(),
      industry: z.string().optional(),
      diversityFocused: z.boolean().optional(),
      minMatchScore: z.number().optional(),
      limit: z.number().default(20),
      offset: z.number().default(0),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.investor.findMany({
        where: {
          verified: true,
          ...(input.diversityFocused && { diversityFocused: true }),
          ...(input.query && {
            OR: [
              { name: { contains: input.query, mode: "insensitive" } },
              { firm: { contains: input.query, mode: "insensitive" } },
              { thesis: { contains: input.query, mode: "insensitive" } },
            ],
          }),
        },
        take: input.limit,
        skip: input.offset,
        orderBy: { firm: "asc" },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.investor.findUniqueOrThrow({ where: { id: input.id } });
    }),
});
