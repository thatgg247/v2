import { router, protectedProcedure } from "@/lib/trpc";
import { z } from "zod";

export const grantsRouter = router({
  search: protectedProcedure
    .input(z.object({
      query: z.string().optional(),
      programType: z.string().optional(),
      geography: z.string().optional(),
      limit: z.number().default(20),
      offset: z.number().default(0),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.grant.findMany({
        where: {
          isActive: true,
          ...(input.query && {
            OR: [
              { title: { contains: input.query, mode: "insensitive" } },
              { agency: { contains: input.query, mode: "insensitive" } },
              { description: { contains: input.query, mode: "insensitive" } },
            ],
          }),
          ...(input.programType && { programType: input.programType }),
        },
        take: input.limit,
        skip: input.offset,
        orderBy: { deadline: "asc" },
      });
    }),
});
