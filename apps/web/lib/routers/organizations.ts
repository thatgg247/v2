import { router, protectedProcedure, adminProcedure } from "@/lib/trpc";
import { z } from "zod";
import { UserRole } from "@seriesos/db";
import { sendTeamInviteEmail } from "@seriesos/email";
import crypto from "crypto";

export const organizationsRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.organization.findUniqueOrThrow({
      where: { id: ctx.session.user.organizationId },
      include: { subscription: true },
    });
  }),

  getMembers: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany({
      where: { organizationId: ctx.session.user.organizationId },
      select: { id: true, name: true, email: true, role: true, lastLoginAt: true, createdAt: true },
    });
  }),

  inviteMember: adminProcedure
    .input(z.object({ email: z.string().email(), role: z.nativeEnum(UserRole).default(UserRole.MEMBER) }))
    .mutation(async ({ ctx, input }) => {
      const inviter = await ctx.prisma.user.findUniqueOrThrow({ where: { id: ctx.session.user.id } });
      const org = await ctx.prisma.organization.findUniqueOrThrow({ where: { id: ctx.session.user.organizationId } });
      const inviteToken = crypto.randomUUID();
      // Create a placeholder user that will be claimed on signup
      await ctx.prisma.user.create({
        data: {
          organizationId: ctx.session.user.organizationId,
          email: input.email,
          name: "Invited User",
          role: input.role,
          inviteToken,
          invitedBy: ctx.session.user.id,
          inviteExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });
      await sendTeamInviteEmail(input.email, inviter.name, org.name, inviteToken);
      return { success: true };
    }),

  removeMember: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.session.user.id) throw new Error("Cannot remove yourself");
      return ctx.prisma.user.deleteMany({
        where: { id: input.userId, organizationId: ctx.session.user.organizationId },
      });
    }),

  update: adminProcedure
    .input(z.object({ name: z.string().min(1).max(200).optional(), logoUrl: z.string().url().optional() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.organization.update({
        where: { id: ctx.session.user.organizationId },
        data: input,
      });
    }),
});
