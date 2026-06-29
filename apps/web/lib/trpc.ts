// ─────────────────────────────────────────────────────────────────────────────
// tRPC server-side configuration
// ─────────────────────────────────────────────────────────────────────────────

import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth";
import { prisma } from "@seriesos/db";
import superjson from "superjson";
import { z } from "zod";
import { ZodError } from "zod";

// Context type
export interface Context {
  session: Awaited<ReturnType<typeof auth>> | null;
  prisma: typeof prisma;
}

// Create context for each request
export async function createContext(): Promise<Context> {
  const session = await auth();
  return { session, prisma };
}

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Protected procedure — requires authentication
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be logged in" });
  }
  return next({ ctx: { ...ctx, session: ctx.session } });
});

// Admin procedure — requires ADMIN or OWNER role
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  const role = ctx.session.user.role;
  if (role !== "ADMIN" && role !== "OWNER") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

// Super admin procedure — for platform-level operations
export const superAdminProcedure = protectedProcedure.use(({ ctx, next }) => {
  const email = ctx.session.user.email;
  const superAdmins = (process.env.SUPER_ADMIN_EMAILS ?? "").split(",");
  if (!superAdmins.includes(email!)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Super admin access required" });
  }
  return next({ ctx });
});
