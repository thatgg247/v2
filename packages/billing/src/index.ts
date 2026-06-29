// ─────────────────────────────────────────────────────────────────────────────
// @seriesos/billing — Stripe billing service
// ─────────────────────────────────────────────────────────────────────────────

import Stripe from "stripe";
import { STRIPE_PRICES } from "@seriesos/lib";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-11-20.acacia" });

export type PlanKey = keyof typeof STRIPE_PRICES;

// Create or retrieve Stripe customer for an organization
export async function getOrCreateCustomer(orgId: string, email: string, name: string): Promise<string> {
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data.length > 0) return existing.data[0].id;
  const customer = await stripe.customers.create({ email, name, metadata: { organizationId: orgId } });
  return customer.id;
}

// Create a Stripe Checkout session for a subscription
export async function createCheckoutSession(opts: {
  customerId: string;
  priceId: string;
  organizationId: string;
  successUrl: string;
  cancelUrl: string;
  trialDays?: number;
}): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    customer: opts.customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: opts.priceId, quantity: 1 }],
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
    subscription_data: {
      trial_period_days: opts.trialDays,
      metadata: { organizationId: opts.organizationId },
    },
    metadata: { organizationId: opts.organizationId },
  });
  return session.url!;
}

// Create a Stripe Customer Portal session (billing management)
export async function createPortalSession(customerId: string, returnUrl: string): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: returnUrl });
  return session.url;
}

// Verify a Stripe webhook signature
export function constructWebhookEvent(payload: string | Buffer, signature: string): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!);
}

// Get subscription details
export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return stripe.subscriptions.retrieve(subscriptionId);
}

// Get price ID for a plan
export function getPriceForPlan(plan: PlanKey): string {
  return STRIPE_PRICES[plan];
}

// Map Stripe price ID back to plan name
export function getPlanFromPriceId(priceId: string): PlanKey | null {
  const entry = Object.entries(STRIPE_PRICES).find(([, v]) => v === priceId);
  return entry ? (entry[0] as PlanKey) : null;
}
