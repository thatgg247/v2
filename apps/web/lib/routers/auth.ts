import { router, publicProcedure, protectedProcedure } from "@/lib/trpc";
import { z } from "zod";
import { hash } from "bcryptjs";
import { prisma, UserRole } from "@seriesos/db";
import { generateSlug } from "@seriesos/lib";
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from "@seriesos/email";
import crypto from "crypto";

export const authRouter = router({
  signUp: publicProcedure
    .input(z.object({
      name: z.string().min(2).max(100),
      email: z.string().email(),
      password: z.string().min(8).max(100),
      inviteToken: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const existing = await prisma.user.findUnique({ where: { email: input.email } });
      if (existing) throw new Error("An account with this email already exists");

      const passwordHash = await hash(input.password, 12);
      const verifyToken = crypto.randomUUID();

      // Handle invite token
      let organizationId: string;
      let role: UserRole = UserRole.OWNER;

      if (input.inviteToken) {
        const invitedUser = await prisma.user.findUnique({ where: { inviteToken: input.inviteToken } });
        if (!invitedUser || !invitedUser.inviteExpiresAt || invitedUser.inviteExpiresAt < new Date()) {
          throw new Error("Invite link is invalid or expired");
        }
        organizationId = invitedUser.organizationId;
        role = invitedUser.role;
        await prisma.user.update({
          where: { id: invitedUser.id },
          data: { name: input.name, email: input.email, passwordHash, verifyToken, inviteToken: null },
        });
      } else {
        // New org
        const slug = generateSlug(input.name);
        const org = await prisma.organization.create({ data: { name: `${input.name}'s Organization`, slug: `${slug}-${Date.now()}` } });
        organizationId = org.id;
        await prisma.subscription.create({
          data: { organizationId: org.id, aiCreditsIncluded: 100, seatsIncluded: 1, companiesIncluded: 1 },
        });
        const user = await prisma.user.create({
          data: { organizationId, email: input.email, name: input.name, passwordHash, role, verifyToken, verifyToken: verifyToken, inviteToken: null },
        });
        await prisma.organization.update({ where: { id: org.id }, data: { adminUserId: user.id } });
        await sendVerificationEmail(input.email, input.name, verifyToken);
        await sendWelcomeEmail(input.email, input.name);
        return { success: true };
      }

      await sendVerificationEmail(input.email, input.name, verifyToken);
      return { success: true };
    }),

  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({ where: { verifyToken: input.token } });
      if (!user) throw new Error("Invalid or expired verification link");
      await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true, verifyToken: null } });
      return { success: true };
    }),

  requestPasswordReset: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({ where: { email: input.email } });
      if (!user) return { success: true }; // Don't reveal if email exists
      const resetToken = crypto.randomUUID();
      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken, resetExpiresAt: new Date(Date.now() + 60 * 60 * 1000) }, // 1 hour
      });
      await sendPasswordResetEmail(user.email, user.name, resetToken);
      return { success: true };
    }),

  resetPassword: publicProcedure
    .input(z.object({ token: z.string(), password: z.string().min(8) }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({ where: { resetToken: input.token } });
      if (!user || !user.resetExpiresAt || user.resetExpiresAt < new Date()) {
        throw new Error("Reset link is invalid or expired");
      }
      const passwordHash = await hash(input.password, 12);
      await prisma.user.update({ where: { id: user.id }, data: { passwordHash, resetToken: null, resetExpiresAt: null } });
      return { success: true };
    }),

  getMe: protectedProcedure.query(async ({ ctx }) => {
    return prisma.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
      select: { id: true, email: true, name: true, role: true, avatarUrl: true, mfaEnabled: true, organizationId: true },
    });
  }),
});
