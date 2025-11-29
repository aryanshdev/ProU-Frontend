"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Layers,
  BarChart2,
  Menu,
  X
} from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import { toast } from "react-toastify";

interface UserInfo {
  name: string;
  email: string;
  pfp: string;
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const router = useRouter();
  const pathname = usePathname(); // nav hook to get current URL path
  const searchParams = useSearchParams(); // navhook to get URL query

  // signout function to clear all data from local Stroage
  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedUser");
    router.push("/");
  };

  useEffect(() => {
    const urlToken = searchParams.get("token");
    let token = localStorage.getItem("authToken");

    if (urlToken) {
      localStorage.setItem("authToken", urlToken);
      token = urlToken;
      router.replace(pathname);
    }

    const storedUser = localStorage.getItem("loggedUser");

    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    } else if (token) {
      fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/whoami", {
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
      toast.error("Please Login To View This Page");
      router.push("/");
    }
  }, [searchParams, pathname, router]); // Run when URL changes

  // responsive design required state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-black text-zinc-100 font-sans selection:bg-blue-500/30 flex-col md:flex-row">
      {/* Small Screen Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-zinc-950">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <span>EmpTrack</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-zinc-400 hover:text-white"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Small Screen Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0
      `}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <span>EmpTrack</span>
          </div>
          {/* Close Button for Small Screens */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-zinc-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 flex flex-col px-4 py-6 space-y-1 gap-2">
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
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-black p-4 md:p-0">
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Load in suspense while the component fetches user details from backend
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
