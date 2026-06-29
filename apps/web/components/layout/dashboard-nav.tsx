"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Building2, ShieldCheck, FolderLock,
  TrendingUp, Mail, Users, Settings, CreditCard, LogOut, ChevronRight
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard",   href: "/dashboard",   icon: LayoutDashboard },
  { label: "Companies",   href: "/companies",   icon: Building2 },
  { label: "Compliance",  href: "/compliance",  icon: ShieldCheck },
  { label: "Data Room",   href: "/data-room",   icon: FolderLock },
  { label: "Funding",     href: "/funding",     icon: TrendingUp },
  { label: "Outreach",    href: "/outreach",    icon: Mail },
  { label: "Pipeline",    href: "/pipeline",    icon: Users },
  { label: "Settings",    href: "/settings",    icon: Settings },
  { label: "Billing",     href: "/billing",     icon: CreditCard },
];

interface Props {
  user: { name?: string | null; email?: string | null; role?: string };
}

export function DashboardNav({ user }: Props) {
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-brand-500 text-white flex flex-col h-full shadow-xl">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-brand-600">
        <h1 className="text-xl font-bold tracking-tight">Series OS</h1>
        <p className="text-brand-200 text-xs mt-0.5">Operating system for founders</p>
      </div>

      {/* Nav items */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                active ? "bg-white text-brand-500 shadow" : "text-brand-100 hover:bg-brand-600"
              }`}>
              <Icon size={18} className={active ? "text-brand-500" : "text-brand-200 group-hover:text-white"} />
              {label}
              {active && <ChevronRight size={14} className="ml-auto text-brand-400" />}
            </Link>
          );
        })}
      </div>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-brand-600">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-brand-300 flex items-center justify-center text-brand-700 font-bold text-sm">
            {user.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-brand-200 text-xs truncate">{user.role}</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-brand-200 hover:text-white transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}
