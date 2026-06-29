interface Props {
  score: { overallScore: number; companyProfileScore: number; teamScore: number; productScore: number; marketScore: number; financialsScore: number; legalScore: number; complianceScore: number; dataRoomScore: number; fundingStrategyScore: number; } | null;
  companyName: string;
}

const CATEGORIES = [
  { key: "companyProfileScore", label: "Company Profile" },
  { key: "teamScore",           label: "Team" },
  { key: "productScore",        label: "Product" },
  { key: "marketScore",         label: "Market" },
  { key: "financialsScore",     label: "Financials" },
  { key: "legalScore",          label: "Legal" },
  { key: "complianceScore",     label: "Compliance" },
  { key: "dataRoomScore",       label: "Data Room" },
  { key: "fundingStrategyScore",label: "Funding Strategy" },
] as const;

function getScoreColor(score: number) {
  if (score >= 80) return "bg-green-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
}

export function ReadinessScoreCard({ score, companyName }: Props) {
  const overall = score?.overallScore ?? 0;
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Readiness Score</h2>
          <p className="text-gray-500 text-sm">{companyName}</p>
        </div>
        <div className="text-right">
          <span className="text-5xl font-bold text-brand-500">{overall}</span>
          <span className="text-gray-400 text-lg">/100</span>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="h-3 bg-gray-100 rounded-full mb-6">
        <div className={`h-full rounded-full transition-all duration-500 ${getScoreColor(overall)}`} style={{ width: `${overall}%` }} />
      </div>

      {/* Category breakdown */}
      <div className="space-y-3">
        {CATEGORIES.map(({ key, label }) => {
          const val = (score?.[key] ?? 0) as number;
          return (
            <div key={key} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-36 shrink-0">{label}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full">
                <div className={`h-full rounded-full ${getScoreColor(val)}`} style={{ width: `${val}%` }} />
              </div>
              <span className="text-sm font-medium text-gray-700 w-8 text-right">{val}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
