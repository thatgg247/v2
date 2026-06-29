import { auth } from "@/lib/auth";
import { prisma } from "@seriesos/db";
import { ReadinessScoreCard } from "@/components/dashboard/readiness-score-card";
import { PortalGrid } from "@/components/dashboard/portal-grid";
import { QuickActions } from "@/components/dashboard/quick-actions";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  const companies = await prisma.company.findMany({
    where: { organizationId: session!.user.organizationId },
    include: { readinessScore: true, readinessPortals: true },
    orderBy: { createdAt: "desc" },
  });

  const activeCompany = companies[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Your fundraising and readiness command center</p>
      </div>

      {!activeCompany ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500 mb-4">No company yet. Create your first company to get started.</p>
          <a href="/companies" className="inline-flex items-center gap-2 bg-brand-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-600 transition-colors">
            Create Company →
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            <ReadinessScoreCard score={activeCompany.readinessScore} companyName={activeCompany.name} />
            <PortalGrid portals={activeCompany.readinessPortals} />
          </div>
          {/* Right column */}
          <div className="space-y-6">
            <QuickActions companyId={activeCompany.id} />
          </div>
        </div>
      )}
    </div>
  );
}
