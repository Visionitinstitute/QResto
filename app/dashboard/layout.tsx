"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ChefHat,
  QrCode,
  Star,
  Settings,
  LogOut,
  Menu as MenuIcon,
  X,
  ExternalLink,
  Store,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface HotelSummary {
  id: string;
  name: string;
  slug: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [hotel, setHotel] = useState<HotelSummary | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    async function loadUserAndHotel() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUserEmail(user.email || null);
          const { data: hotelData } = await supabase
            .from("hotels")
            .select("id, name, slug")
            .eq("owner_id", user.id)
            .maybeSingle();

          if (hotelData) {
            setHotel(hotelData);
          }
        }
      } catch (err) {
        console.error("Error loading user/hotel in dashboard layout:", err);
      }
    }

    loadUserAndHotel();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Live Orders", href: "/dashboard/orders", icon: UtensilsCrossed },
    { name: "Menu Items", href: "/dashboard/menu", icon: ChefHat },
    { name: "QR Codes", href: "/dashboard/qr", icon: QrCode },
    { name: "Reviews", href: "/dashboard/reviews", icon: Star },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white border-r border-zinc-200/80 sticky top-0 h-screen select-none">
        {/* Brand Header */}
        <div className="h-16 border-b border-zinc-100 flex items-center justify-between px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-zinc-900 leading-none">
                QResto
              </span>
              <span className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase mt-0.5">
                Manager Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Hotel Identity Card */}
        {hotel && (
          <div className="p-3 mx-3 my-2 rounded-xl bg-zinc-50 border border-zinc-200/80">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                <Store className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-zinc-900 truncate">
                  {hotel.name}
                </p>
                <Link
                  href={`/menu/${hotel.slug}`}
                  target="_blank"
                  className="text-[11px] text-zinc-500 hover:text-orange-600 flex items-center gap-1 font-medium transition"
                >
                  View Public Menu <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition ${
                  isActive
                    ? "bg-orange-50 text-orange-950 font-semibold border border-orange-200/60 shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 font-medium"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-orange-600" : "text-zinc-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Footer & Logout */}
        <div className="p-3 border-t border-zinc-100">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Logged In As
              </p>
              <p className="text-xs text-zinc-700 font-medium truncate max-w-[140px]">
                {userEmail || "Manager"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-red-600 hover:bg-red-50/80 rounded-lg transition border border-zinc-200/70 hover:border-red-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200 px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center text-white">
            <UtensilsCrossed className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-base text-zinc-900">QResto</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100 transition"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-zinc-200 p-4 space-y-1.5 animate-in slide-in-from-top-2">
          {hotel && (
            <div className="p-2.5 mb-2 rounded-xl bg-zinc-50 border border-zinc-200/80">
              <p className="text-xs font-bold text-zinc-900">{hotel.name}</p>
              <Link
                href={`/menu/${hotel.slug}`}
                target="_blank"
                className="text-xs text-orange-600 font-medium inline-flex items-center gap-1 mt-0.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                View Public Menu <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium ${
                  isActive
                    ? "bg-orange-50 text-orange-950 font-semibold border border-orange-200/60"
                    : "text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-orange-600" : "text-zinc-400"}`} />
                {item.name}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-zinc-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-xl"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
