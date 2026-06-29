"use client";
import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/components/providers";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);

  const signUp = trpc.auth.signUp.useMutation({
    onSuccess: () => setDone(true),
  });

  if (done) return (
    <div className="text-center space-y-4">
      <div className="text-4xl">✉️</div>
      <h2 className="text-xl font-semibold text-gray-800">Check your email</h2>
      <p className="text-gray-600 text-sm">We sent a verification link to <strong>{email}</strong>. Click it to activate your account.</p>
    </div>
  );

  return (
    <form onSubmit={e => { e.preventDefault(); signUp.mutate({ name, email, password }); }} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Create your account</h2>
      {signUp.error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{signUp.error.message}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input type="text" required value={name} onChange={e => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password (8+ characters)</label>
        <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400" />
      </div>
      <button type="submit" disabled={signUp.isPending}
        className="w-full py-2.5 bg-brand-500 text-white font-semibold rounded-lg hover:bg-brand-600 disabled:opacity-50 transition-colors">
        {signUp.isPending ? "Creating account..." : "Create Account →"}
      </button>
      <p className="text-center text-sm text-gray-600">
        Have an account? <Link href="/login" className="text-brand-400 hover:underline font-medium">Sign in →</Link>
      </p>
    </form>
  );
}
