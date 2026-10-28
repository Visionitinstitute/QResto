"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UtensilsCrossed, Menu, X, ArrowRight, Sparkles } from "lucide-react";

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-zinc-950 font-sans">
                  QResto
                </span>
                <span className="text-[10px] font-semibold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  QR OS
                </span>
              </div>
              <span className="text-[11px] font-medium text-zinc-600 hidden sm:block">
                Digital Menus & Table Ordering
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
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              href="/signup"
              className="text-xs font-semibold bg-orange-600 text-white px-3 py-1.5 rounded-lg"
            >
              Free Trial
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="p-2 rounded-lg text-zinc-700 hover:bg-zinc-100 transition-colors"
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

          <div className="pt-4 border-t border-zinc-100 flex flex-col gap-2.5">
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
          </div>
        </div>
      )}
    </header>
  );
}
