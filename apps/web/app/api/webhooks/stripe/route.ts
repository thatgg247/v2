export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent, getPlanFromPriceId } from "@seriesos/billing";
import { prisma, Plan, SubscriptionStatus } from "@seriesos/db";
import Stripe from "stripe";

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(body, signature);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orgId = session.metadata?.organizationId;
        if (!orgId || !session.subscription) break;
        await prisma.organization.update({
          where: { id: orgId },
          data: { stripeCustomerId: session.customer as string, stripeSubscriptionId: session.subscription as string },
        });
        break;
      }
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const sub = await prisma.subscription.findFirst({ where: { stripeSubscriptionId: invoice.subscription as string } });
        if (!sub) break;
        await prisma.subscription.update({
          where: { id: sub.id },
          data: { status: SubscriptionStatus.ACTIVE, aiCreditsUsed: 0 }, // Reset credits on renewal
        });
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const sub = await prisma.subscription.findFirst({ where: { stripeSubscriptionId: invoice.subscription as string } });
        if (!sub) break;
        await prisma.subscription.update({ where: { id: sub.id }, data: { status: SubscriptionStatus.PAST_DUE } });
        break;
      }
      case "customer.subscription.updated": {
        const stripeSub = event.data.object as Stripe.Subscription;
        const sub = await prisma.subscription.findFirst({ where: { stripeSubscriptionId: stripeSub.id } });
        if (!sub) break;
        const priceId = stripeSub.items.data[0]?.price.id;
        const plan = priceId ? getPlanFromPriceId(priceId) : null;
        await prisma.subscription.update({
          where: { id: sub.id },
          data: {
            status: stripeSub.status.toUpperCase() as SubscriptionStatus,
            currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
            ...(plan && { plan: plan as Plan }),
          },
        });
        break;
      }
      case "customer.subscription.deleted": {
        const stripeSub = event.data.object as Stripe.Subscription;
        const sub = await prisma.subscription.findFirst({ where: { stripeSubscriptionId: stripeSub.id } });
        if (!sub) break;
        await prisma.subscription.update({ where: { id: sub.id }, data: { status: SubscriptionStatus.CANCELLED, cancelledAt: new Date() } });
        break;
      }
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
