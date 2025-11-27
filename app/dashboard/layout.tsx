'use client'
import Link from "next/link";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  LogOut,
  Users,
  Layers,
  BarChart2,
} from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userInfo, setUserInfo] = useState(null)
  return (
    <div className="flex h-screen bg-black text-zinc-100 font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-zinc-950 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <span>EmpTrack</span>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 flex flex-col px-4 py-6 space-y-1 gap-5">
          <NavItem
            href="/dashboard"
            icon={<LayoutDashboard />}
            label="Overview"
            active
          />
          <NavItem
            href="/dashboard/stats"
            icon={<BarChart2 />}
            label="Analytics"
          />
        </nav>

        {/* User Details Section */}
        <div className="p-4 border-t border-white/5">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-black">{children}</main>
    </div>
  );
}

// Helper Component for Sidebar Links
function NavItem({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: any;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all  ${
        active
          ? "bg-blue-500/10 text-blue-400"
          : "text-zinc-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <div className="h-4 w-4">{icon}</div>
      {label}
    </Link>
  );
}
