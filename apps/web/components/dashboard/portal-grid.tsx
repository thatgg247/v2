import { Lock, Unlock } from "lucide-react";
import type { ReadinessPortal, PortalType } from "@seriesos/db";

const PORTAL_META: Record<string, { label: string; emoji: string }> = {
  INVESTOR:           { label: "Investor Ready",          emoji: "🏦" },
  GRANT:              { label: "Grant Ready",             emoji: "🏛️" },
  ENTERPRISE:         { label: "Enterprise Ready",        emoji: "🏢" },
  GOVERNMENT_CONTRACT:{ label: "Gov. Contract Ready",     emoji: "🇺🇸" },
  COMPLIANCE:         { label: "Compliance Ready",        emoji: "✅" },
  ACQUISITION:        { label: "Acquisition Ready",       emoji: "🤝" },
  FDA:                { label: "FDA Ready",               emoji: "🔬" },
  SBIR:               { label: "SBIR Ready",              emoji: "🚀" },
  MANUFACTURING:      { label: "Manufacturing Ready",     emoji: "🏭" },
  RETAIL:             { label: "Retail Ready",            emoji: "🛍️" },
  INTERNATIONAL:      { label: "International Ready",     emoji: "🌍" },
};

export function PortalGrid({ portals }: { portals: ReadinessPortal[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Readiness Portals</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {portals.map(portal => {
          const meta = PORTAL_META[portal.portalType] ?? { label: portal.portalType, emoji: "🔒" };
          return (
            <div key={portal.id}
              className={`rounded-xl p-3 border-2 transition-all ${portal.locked ? "border-gray-200 bg-gray-50 opacity-70" : "border-brand-300 bg-brand-50"}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-lg">{meta.emoji}</span>
                {portal.locked ? <Lock size={14} className="text-gray-400" /> : <Unlock size={14} className="text-green-500" />}
              </div>
              <p className="text-xs font-medium text-gray-700 leading-tight">{meta.label}</p>
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full">
                <div className="h-full bg-brand-400 rounded-full" style={{ width: `${portal.completionPct}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{portal.completionPct}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
