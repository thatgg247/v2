"use client";
import { trpc } from "@/components/providers";

const PLANS = [
  { key: "FOUNDER_STARTER", name: "Founder Starter", price: "$29/mo", companies: 1, seats: 1, credits: 100, desc: "Solo founders, pre-revenue" },
  { key: "FOUNDER_PRO",     name: "Founder Pro",     price: "$79/mo", companies: 3, seats: 3, credits: 500, desc: "Actively fundraising" },
  { key: "FOUNDER_SCALE",   name: "Founder Scale",   price: "$149/mo", companies: 5, seats: 5, credits: 2000, desc: "Multi-company operators" },
  { key: "ADVISOR",         name: "Advisor",          price: "$99/mo", companies: 10, seats: 5, credits: 1000, desc: "Consultants & advisors" },
  { key: "ACCELERATOR",     name: "Accelerator",      price: "$499/mo", companies: 50, seats: 20, credits: 10000, desc: "Accelerators & incubators" },
] as const;

export default function BillingPage() {
  const { data: sub } = trpc.billing.getSubscription.useQuery();
  const checkout = trpc.billing.createCheckoutSession.useMutation({
    onSuccess: ({ url }) => { window.location.href = url; },
  });
  const portal = trpc.billing.createPortalSession.useMutation({
    onSuccess: ({ url }) => { window.location.href = url; },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing & Plans</h1>
        <p className="text-gray-500 mt-1">Manage your subscription and usage</p>
      </div>

      {sub && (
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-brand-600 font-medium">Current Plan</p>
            <p className="text-2xl font-bold text-brand-700">{sub.plan.replace(/_/g, " ")}</p>
            <p className="text-sm text-gray-500 mt-1">
              {sub.aiCreditsUsed} / {sub.aiCreditsIncluded} AI credits used this month
            </p>
          </div>
          <button onClick={() => portal.mutate()}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition-colors">
            Manage Billing →
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLANS.map(plan => {
          const isCurrent = sub?.plan === plan.key;
          return (
            <div key={plan.key}
              className={`rounded-2xl border-2 p-6 ${isCurrent ? "border-brand-400 bg-brand-50" : "border-gray-200 bg-white"}`}>
              {isCurrent && <span className="text-xs font-bold text-brand-600 bg-brand-100 px-2 py-0.5 rounded-full">CURRENT PLAN</span>}
              <h3 className="text-lg font-bold text-gray-900 mt-2">{plan.name}</h3>
              <p className="text-3xl font-bold text-brand-500 mt-1">{plan.price}</p>
              <p className="text-sm text-gray-500 mt-1 mb-4">{plan.desc}</p>
              <ul className="space-y-1 text-sm text-gray-600 mb-6">
                <li>✓ {plan.companies} {plan.companies === 1 ? "company" : "companies"}</li>
                <li>✓ {plan.seats} {plan.seats === 1 ? "seat" : "seats"}</li>
                <li>✓ {plan.credits.toLocaleString()} AI credits/mo</li>
              </ul>
              {!isCurrent && (
                <button onClick={() => checkout.mutate({ plan: plan.key })}
                  className="w-full py-2 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition-colors text-sm">
                  {checkout.isPending ? "Loading..." : "Upgrade →"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
