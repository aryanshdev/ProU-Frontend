"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Layers,
  BarChart2,
  UserCircle,
} from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import { toast } from "react-toastify";

interface UserInfo {
  name: string;
  email: string;
  pfp: string;
}

// 1. We separate the logic component to wrap it in Suspense later
function DashboardContent({ children }: { children: React.ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const router = useRouter();
  const pathname = usePathname(); // Hook to get current URL path
  const searchParams = useSearchParams(); // Hook to get URL queries (?token=...)

  useEffect(() => {
    // --- STEP 1: Check for Token in URL (First Priority) ---
    const urlToken = searchParams.get("token");
    let token = localStorage.getItem("authToken");

    if (urlToken) {
      // Save it
      localStorage.setItem("authToken", urlToken);
      token = urlToken;

      // Clean the URL (Remove ?token=...) so the user doesn't see it
      router.replace(pathname);
    }

    // --- STEP 2: Handle User Data ---
    const storedUser = localStorage.getItem("loggedUser");

    if (storedUser) {
      // Optimization: Load from cache immediately for speed
      setUserInfo(JSON.parse(storedUser));
    } else if (token) {
      // If we have a token but no user data, fetch it
      fetch("http://localhost:10000/auth/whoami", {
        headers: {
          auth: `${token}`, // Matches your backend requirement
        },
      })
        .then((res) => {
          if (res.status === 403 || res.status === 401) throw "ReLogin";
          return res.json();
        })
        .then((data) => {
          setUserInfo(data);
          localStorage.setItem("loggedUser", JSON.stringify(data));
        })
        .catch(() => {
          handleSignOut(); // If fetch fails, force logout
          toast.error("Session expired, please login again");
        });
    } else {
      // No token at all? Redirect.
      toast.error("Please Login To View This Page");
      router.push("/");
    }
  }, [searchParams, pathname, router]); // Run when URL changes

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedUser");
    router.push("/");
  };

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
        <nav className="flex-1 flex flex-col px-4 py-6 space-y-1 gap-2">
          {/* We pass the current pathname to check active state */}
          <NavItem
            href="/dashboard"
            label="Overview"
            icon={<LayoutDashboard className="h-4 w-4" />}
            currentPath={pathname}
          />
          <NavItem
            href="/dashboard/stats"
            label="Analytics"
            icon={<BarChart2 className="h-4 w-4" />}
            currentPath={pathname}
          />
        </nav>

        {/* User Details & Logout Section */}
        <div className="p-4 border-t border-white/5 bg-zinc-900/50">
          {userInfo && (
            <div className="flex items-center gap-3 mb-4 px-2">
              <img
                className="rounded-full h-8 w-8 border border-white/10"
                src={userInfo.pfp}
                alt="Profile"
              />
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">
                  {userInfo.name || "User"}
                </p>
                <p className="text-xs text-zinc-500 truncate">
                  {userInfo.email}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
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

// 2. Export the Layout wrapped in Suspense
// Next.js requires Suspense when using useSearchParams in a layout to avoid build errors
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="bg-black h-screen text-white p-10">Loading...</div>
      }
    >
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}

// 3. Updated NavItem to handle Active State automatically
function NavItem({
  href,
  label,
  icon,
  currentPath,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  currentPath: string;
}) {
  // Check if current path matches this link
  const isActive = currentPath === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
        isActive
          ? "bg-blue-500/10 text-blue-400"
          : "text-zinc-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
