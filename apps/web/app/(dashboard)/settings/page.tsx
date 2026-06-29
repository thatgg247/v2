"use client";
import { trpc } from "@/components/providers";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { data: me } = trpc.auth.getMe.useQuery();
  const update = trpc.companies.update.useMutation();
  const { data: companies } = trpc.companies.list.useQuery();
  const company = companies?.[0];

  const [form, setForm] = useState({ name: "", description: "", problem: "", solution: "", traction: "", useOfFunds: "", websiteUrl: "", pitchDeckUrl: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (company) setForm({ name: company.name, description: company.description ?? "", problem: company.problem ?? "", solution: company.solution ?? "", traction: company.traction ?? "", useOfFunds: company.useOfFunds ?? "", websiteUrl: company.websiteUrl ?? "", pitchDeckUrl: company.pitchDeckUrl ?? "" });
  }, [company]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!company) return;
    await update.mutateAsync({ id: company.id, ...form });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const fields = [
    { key: "name",        label: "Company Name",     type: "text",     rows: 0 },
    { key: "description", label: "Description",       type: "textarea", rows: 3 },
    { key: "problem",     label: "Problem",           type: "textarea", rows: 2 },
    { key: "solution",    label: "Solution",          type: "textarea", rows: 2 },
    { key: "traction",    label: "Traction",          type: "textarea", rows: 2 },
    { key: "useOfFunds",  label: "Use of Funds",      type: "textarea", rows: 2 },
    { key: "websiteUrl",  label: "Website URL",       type: "url",      rows: 0 },
    { key: "pitchDeckUrl",label: "Pitch Deck URL",    type: "url",      rows: 0 },
  ] as const;

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Your company profile powers AI matching and readiness scoring</p>
      </div>
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            {f.type === "textarea" ? (
              <textarea rows={f.rows} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
            ) : (
              <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
            )}
          </div>
        ))}
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={update.isPending}
            className="px-6 py-2.5 bg-brand-500 text-white font-semibold rounded-lg hover:bg-brand-600 disabled:opacity-50 transition-colors">
            {update.isPending ? "Saving..." : "Save Changes"}
          </button>
          {saved && <span className="text-green-600 text-sm font-medium">✓ Saved</span>}
        </div>
      </form>
    </div>
  );
}
