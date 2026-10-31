"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Settings,
  Utensils,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface UserProfile {
  id: string;
  email: string | null;
  name: string;
  hotelName?: string | null;
}

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch logged in user and optional hotel details
  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient();
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (authUser) {
          let hotelName: string | null = null;
          try {
            const { data: hotelData } = await supabase
              .from("hotels")
              .select("name")
              .eq("owner_id", authUser.id)
              .maybeSingle();
            hotelName = hotelData?.name || null;
          } catch {
            // ignore error
          }

          const fullName =
            authUser.user_metadata?.full_name ||
            hotelName ||
            authUser.email?.split("@")[0] ||
            "Manager";

          setUser({
            id: authUser.id,
            email: authUser.email || null,
            name: fullName,
            hotelName,
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth check error in navbar:", err);
      }
    }

    checkAuth();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      setDropdownOpen(false);
      window.location.reload();
    } catch (err) {
      console.error("Logout error:", err);
      setIsLoggingOut(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-xs border-b border-zinc-200/80 py-3"
          : "bg-white/95 backdrop-blur-xs border-b border-zinc-100 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#0B192C] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5 text-[#0E8388]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-[#0B192C] font-sans">
                  Mera<span className="text-[#0E8388]">Resto</span>
                </span>
                <span className="text-[10px] font-semibold bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  SaaS
                </span>
              </div>
              <span className="text-[11px] font-medium text-zinc-500 hidden sm:block">
                Your Restaurant, Your Digital World.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-600">
            <a
              href="#features"
              className="hover:text-orange-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-orange-600 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#benefits"
              className="hover:text-orange-600 transition-colors"
            >
              Benefits
            </a>
            <a
              href="#pricing"
              className="hover:text-orange-600 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="hover:text-orange-600 transition-colors"
            >
              Reviews
            </a>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-zinc-200 hover:border-orange-300 hover:bg-orange-50/50 transition-all cursor-pointer bg-white shadow-xs"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-zinc-900 leading-tight max-w-[120px] truncate">
                      {user.name}
                    </span>
                    {user.hotelName && (
                      <span className="text-[10px] text-zinc-500 leading-tight max-w-[120px] truncate">
                        {user.hotelName}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-zinc-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-zinc-100">
                      <p className="text-xs font-bold text-zinc-950 truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-zinc-500 truncate">
                        {user.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-orange-50 hover:text-orange-600 transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-orange-600" />
                        <span>Manager Dashboard</span>
                      </Link>

                      <Link
                        href="/dashboard/orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-orange-50 hover:text-orange-600 transition"
                      >
                        <Utensils className="w-4 h-4 text-zinc-400" />
                        <span>Live Orders</span>
                      </Link>

                      <Link
                        href="/dashboard/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-orange-50 hover:text-orange-600 transition"
                      >
                        <Settings className="w-4 h-4 text-zinc-400" />
                        <span>Settings</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-zinc-100">
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>
                          {isLoggingOut ? "Signing out..." : "Sign Out"}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs font-medium text-zinc-700 hover:text-zinc-950 px-3 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white px-4 py-2.5 rounded-xl transition-all shadow-md shadow-orange-600/20 hover:shadow-orange-600/30 hover:-translate-y-0.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-200" />
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button & Profile Avatar */}
          <div className="flex sm:hidden items-center gap-2">
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-200/80 px-2.5 py-1.5 rounded-xl text-xs font-bold"
              >
                <div className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[75px] truncate">{user.name}</span>
              </Link>
            ) : (
              <Link
                href="/signup"
                className="text-xs font-semibold bg-orange-600 text-white px-3 py-1.5 rounded-lg"
              >
                Free Trial
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="p-2 rounded-lg text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-zinc-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3 font-medium text-zinc-800 text-base">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-orange-600"
            >
              Features & Platform
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-orange-600"
            >
              How It Works
            </a>
            <a
              href="#benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-orange-600"
            >
              Restaurant Benefits
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-orange-600"
            >
              Pricing & Plans
            </a>
            <a
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-orange-600"
            >
              Owner Reviews
            </a>
          </div>

          <div className="pt-4 border-t border-zinc-100">
            {user ? (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-zinc-950 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 rounded-xl bg-orange-600 text-white font-semibold text-sm hover:bg-orange-700 flex items-center justify-center gap-1.5"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="text-center py-2.5 rounded-xl border border-red-200 bg-red-50 font-medium text-sm text-red-600 hover:bg-red-100 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl border border-zinc-200 font-medium text-sm text-zinc-800 hover:bg-zinc-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-orange-600 text-white font-semibold text-sm hover:bg-orange-700"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
