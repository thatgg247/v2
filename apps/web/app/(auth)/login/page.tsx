"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Sign in to your account</h2>
      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400" />
      </div>
      <div className="flex items-center justify-between text-sm">
        <Link href="/reset-password" className="text-brand-400 hover:underline">Forgot password?</Link>
      </div>
      <button type="submit" disabled={loading}
        className="w-full py-2.5 bg-brand-500 text-white font-semibold rounded-lg hover:bg-brand-600 disabled:opacity-50 transition-colors">
        {loading ? "Signing in..." : "Sign In →"}
      </button>
      <button type="button" onClick={() => signIn("google")}
        className="w-full py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
        Continue with Google
      </button>
      <p className="text-center text-sm text-gray-600">
        No account? <Link href="/signup" className="text-brand-400 hover:underline font-medium">Create one →</Link>
      </p>
    </form>
  );
}
