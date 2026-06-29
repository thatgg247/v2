// ─────────────────────────────────────────────────────────────────────────────
// NextAuth.js v5 configuration
// ─────────────────────────────────────────────────────────────────────────────

import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@seriesos/db";
import { compare } from "bcryptjs";
import { z } from "zod";

// Extend session type to include org + role
declare module "next-auth" {
  interface Session {
    user: { id: string; organizationId: string; role: string; } & DefaultSession["user"];
  }
  interface User {
    organizationId?: string;
    role?: string;
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/verify-email",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: { email: { type: "email" }, password: { type: "password" } },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user || !user.passwordHash) return null;

        // Check account lockout
        if (user.lockedUntil && user.lockedUntil > new Date()) return null;

        const isValid = await compare(parsed.data.password, user.passwordHash);

        if (!isValid) {
          // Increment failed attempts
          const attempts = user.loginAttempts + 1;
          await prisma.user.update({
            where: { id: user.id },
            data: {
              loginAttempts: attempts,
              lockedUntil: attempts >= 10 ? new Date(Date.now() + 15 * 60 * 1000) : null,
            },
          });
          return null;
        }

        if (!user.emailVerified) return null;

        // Reset failed attempts on success
        await prisma.user.update({
          where: { id: user.id },
          data: { loginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          organizationId: user.organizationId,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.organizationId = user.organizationId;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.organizationId = token.organizationId as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
