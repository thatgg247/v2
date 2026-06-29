"use client";
import { trpc } from "@/components/providers";
import { useState } from "react";
import { Building2, Plus } from "lucide-react";

export default function CompaniesPage() {
  const { data: companies, refetch } = trpc.companies.list.useQuery();
  const create = trpc.companies.create.useMutation({ onSuccess: () => { setShowNew(false); refetch(); } });
  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-500 mt-1">Manage your portfolio companies</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 transition-colors">
          <Plus size={16} /> Add Company
        </button>
      </div>

      {showNew && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">New Company</h2>
          <div className="flex gap-3">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Company name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
            <button onClick={() => create.mutate({ name })} disabled={!name || create.isPending}
              className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 disabled:opacity-50">
              {create.isPending ? "Creating..." : "Create"}
            </button>
            <button onClick={() => setShowNew(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies?.map(c => (
          <div key={c.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-brand-300 hover:shadow-md transition-all">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
                <Building2 size={18} className="text-brand-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{c.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{c.industry?.replace(/_/g," ")} · {c.stage?.replace(/_/g," ")}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-500">{c.readinessScore?.overallScore ?? 0}</p>
                <p className="text-xs text-gray-400">Readiness</p>
              </div>
              <a href={`/settings?company=${c.id}`}
                className="text-xs text-brand-500 font-medium hover:underline">Edit profile →</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
