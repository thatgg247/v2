import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ACTIONS = [
  { label: "Complete Company Profile",  href: "/settings",    desc: "Boost your readiness score" },
  { label: "Build Your Data Room",      href: "/data-room",   desc: "Upload pitch deck + financials" },
  { label: "Find Investors",            href: "/funding",     desc: "Search by stage and thesis" },
  { label: "Run Compliance Check",      href: "/compliance",  desc: "See what frameworks apply to you" },
  { label: "Generate Outreach Email",   href: "/outreach",    desc: "AI-written investor intro" },
];

export function QuickActions({ companyId }: { companyId: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="space-y-2">
        {ACTIONS.map(a => (
          <Link key={a.href} href={a.href}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-50 border border-transparent hover:border-brand-200 transition-all group">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 group-hover:text-brand-600">{a.label}</p>
              <p className="text-xs text-gray-400">{a.desc}</p>
            </div>
            <ArrowRight size={14} className="text-gray-300 group-hover:text-brand-400" />
          </Link>
        ))}
      </div>
    </div>
  );
}
