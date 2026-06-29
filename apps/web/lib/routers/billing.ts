import { router, protectedProcedure, adminProcedure } from "@/lib/trpc";
import { z } from "zod";
import { getOrCreateCustomer, createCheckoutSession, createPortalSession } from "@seriesos/billing";
import { STRIPE_PRICES } from "@seriesos/lib";

export const billingRouter = router({
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.subscription.findUnique({ where: { organizationId: ctx.session.user.organizationId } });
  }),

  createCheckoutSession: adminProcedure
    .input(z.object({ plan: z.enum(["FOUNDER_STARTER","FOUNDER_PRO","FOUNDER_SCALE","ADVISOR","ACCELERATOR"]) }))
    .mutation(async ({ ctx, input }) => {
      const org = await ctx.prisma.organization.findUniqueOrThrow({ where: { id: ctx.session.user.organizationId } });
      const user = await ctx.prisma.user.findUniqueOrThrow({ where: { id: ctx.session.user.id } });
      const customerId = await getOrCreateCustomer(org.id, user.email, org.name);
      const priceId = STRIPE_PRICES[input.plan];
      const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
      const url = await createCheckoutSession({
        customerId, priceId, organizationId: org.id,
        successUrl: `${appUrl}/billing?success=1`,
        cancelUrl: `${appUrl}/billing?cancelled=1`,
        trialDays: 14,
      });
      return { url };
    }),

  createPortalSession: adminProcedure.mutation(async ({ ctx }) => {
    const org = await ctx.prisma.organization.findUniqueOrThrow({ where: { id: ctx.session.user.organizationId } });
    if (!org.stripeCustomerId) throw new Error("No active subscription");
    const url = await createPortalSession(org.stripeCustomerId, `${process.env.NEXT_PUBLIC_APP_URL}/billing`);
    return { url };
  }),

  getUsage: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await ctx.prisma.subscription.findUnique({ where: { organizationId: ctx.session.user.organizationId } });
    const events = await ctx.prisma.usageEvent.groupBy({
      by: ["eventType"],
      where: { organizationId: ctx.session.user.organizationId },
      _sum: { quantity: true },
    });
    return { subscription, events };
  }),
});
