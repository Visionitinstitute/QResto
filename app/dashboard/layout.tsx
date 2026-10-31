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
  Sparkles,
  Lock,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getStoredSubscription,
  UserSubscription,
  SubscriptionPlanId,
} from "@/lib/subscription";
import { PlanUpgradeModal } from "@/components/dashboard/PlanUpgradeModal";
import { Button } from "@/components/ui/Button";

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
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

          const sub = getStoredSubscription(user, hotelData?.id);
          setSubscription(sub);
        }
      } catch (err) {
        console.error("Error loading user/hotel in dashboard layout:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUserAndHotel();

    const handleSubUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<UserSubscription>;
      if (customEvent.detail) {
        setSubscription(customEvent.detail);
      }
    };
    window.addEventListener("meraresto:subscription-updated", handleSubUpdated);
    return () => {
      window.removeEventListener("meraresto:subscription-updated", handleSubUpdated);
    };
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
    { name: "Menu Dishes", href: "/dashboard/menu", icon: ChefHat },
    { name: "QR Codes", href: "/dashboard/qr", icon: QrCode },
    { name: "Reviews", href: "/dashboard/reviews", icon: Star },
    { name: "Settings & Billing", href: "/dashboard/settings", icon: Settings },
  ];

  // Paywall guard: If user does not have a hotel or active subscription, and tries to visit sub-routes
  const isSetupIncomplete = !loading && (!hotel || !subscription);
  const isSubRoute = pathname !== "/dashboard";

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row font-sans">
      {/* Plan Upgrade Modal */}
      <PlanUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        currentPlanId={subscription?.planId || "starter"}
        onPlanUpdated={(newSub) => setSubscription(newSub)}
      />

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-60 flex-col bg-white border-r border-zinc-200/80 sticky top-0 h-screen select-none">
        {/* Brand Header */}
        <div className="h-14 border-b border-zinc-100 flex items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0B192C] border border-[#39ff14]/40 flex items-center justify-center text-white shadow-2xs">
              <UtensilsCrossed className="w-4 h-4 text-[#39ff14]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-[#0B192C] leading-none">
                Mera<span className="text-emerald-600">Resto</span>
              </span>
              <span className="text-[9px] text-zinc-400 font-semibold tracking-wider uppercase mt-0.5">
                Manager Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Hotel Identity Card */}
        {hotel && (
          <div className="p-2.5 mx-2.5 my-2 rounded-xl bg-zinc-50 border border-zinc-200/80">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Store className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-zinc-900 truncate">
                  {hotel.name}
                </p>
                <Link
                  href={`/menu/${hotel.slug}`}
                  target="_blank"
                  className="text-[10px] text-zinc-500 hover:text-emerald-700 flex items-center gap-1 font-medium transition"
                >
                  View Public Menu <ExternalLink className="w-2.5 h-2.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Active Plan Widget in Sidebar */}
        {subscription && (
          <div className="mx-2.5 mb-2 p-2.5 rounded-xl bg-[#0B192C] text-white flex items-center justify-between shadow-xs">
            <div>
              <p className="text-[9px] uppercase tracking-wider text-[#39ff14] font-black">
                Plan
              </p>
              <p className="text-xs font-bold text-white truncate max-w-[95px]">
                {subscription.plan.name}
              </p>
            </div>
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="px-2 py-1 rounded-lg bg-[#39ff14] hover:bg-emerald-400 text-[#0B192C] text-[10px] font-black uppercase transition cursor-pointer"
            >
              Upgrade
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition ${
                  isActive
                    ? "bg-[#0B192C] text-[#39ff14] font-bold shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 font-medium"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#39ff14]" : "text-zinc-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Footer & Logout */}
        <div className="p-2.5 border-t border-zinc-100">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="min-w-0">
              <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider">
                Logged In
              </p>
              <p className="text-[11px] text-zinc-700 font-medium truncate max-w-[140px]">
                {userEmail || "Manager"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition border border-zinc-200 hover:border-red-200 cursor-pointer"
          >
            <LogOut className="w-3 h-3" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 px-3.5 h-13 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#0B192C] border border-[#39ff14]/40 flex items-center justify-center text-white">
            <UtensilsCrossed className="w-3.5 h-3.5 text-[#39ff14]" />
          </div>
          <span className="font-bold text-sm text-[#0B192C]">
            Mera<span className="text-emerald-600">Resto</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {subscription && (
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="px-2 py-0.5 rounded-full bg-[#0B192C] text-[#39ff14] text-[10px] font-bold border border-[#39ff14]/40"
            >
              {subscription.plan.name}
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100 transition cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-zinc-200 p-3 space-y-1 animate-in slide-in-from-top-2">
          {hotel && (
            <div className="p-2 mb-1.5 rounded-lg bg-zinc-50 border border-zinc-200/80">
              <p className="text-xs font-bold text-zinc-900">{hotel.name}</p>
              <Link
                href={`/menu/${hotel.slug}`}
                target="_blank"
                className="text-[11px] text-emerald-700 font-medium inline-flex items-center gap-1 mt-0.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                View Public Menu <ExternalLink className="w-2.5 h-2.5" />
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
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium ${
                  isActive
                    ? "bg-[#0B192C] text-[#39ff14] font-bold"
                    : "text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#39ff14]" : "text-zinc-400"}`} />
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
              className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
            >
              <LogOut className="w-3 h-3" /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-3 sm:p-5 lg:p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Sub-route Paywall Protection: Block access if onboarding/payment is incomplete */}
          {isSetupIncomplete && isSubRoute ? (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 max-w-md mx-auto animate-in fade-in">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 shadow-xs">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-zinc-950 tracking-tight">
                Subscription Plan Required
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 mt-2 mb-6 leading-relaxed">
                You must select a subscription plan and complete activation before accessing this feature.
              </p>
              <Button
                onClick={() => router.push("/dashboard")}
                size="lg"
                className="bg-[#0B192C] hover:bg-black text-[#39ff14] border border-[#39ff14]/40 font-bold"
              >
                Complete Setup & Select Plan <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  );
}
