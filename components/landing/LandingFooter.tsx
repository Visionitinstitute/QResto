import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white pt-16 pb-12 text-zinc-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-100">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0B192C] flex items-center justify-center text-white shadow-md">
                <UtensilsCrossed className="w-5 h-5 text-[#0E8388]" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold tracking-tight text-[#0B192C]">
                  Mera<span className="text-[#0E8388]">Resto</span>
                </span>
                <span className="text-[10px] font-semibold bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  SaaS
                </span>
              </div>
            </Link>

            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
              The modern digital menu and QR table ordering platform designed to speed up service, boost check sizes, and eliminate paper printing costs for restaurants, cafes, and bars.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-zinc-800">
                All Systems Operational
              </span>
              <span className="text-zinc-300">•</span>
              <span className="text-xs text-zinc-400">Next.js 16 + Supabase</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold text-zinc-950 uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#features" className="hover:text-orange-600 transition-colors">
                  QR Code Generator
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-orange-600 transition-colors">
                  Kitchen Display (KDS)
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-orange-600 transition-colors">
                  Dietary & Allergen Badges
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-orange-600 transition-colors">
                  Automated Upsell Engine
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-orange-600 transition-colors">
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Solutions Links */}
          <div>
            <h4 className="text-xs font-bold text-zinc-950 uppercase tracking-wider mb-4">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <span className="hover:text-orange-600 transition-colors cursor-pointer">
                  Casual Dining & Bistros
                </span>
              </li>
              <li>
                <span className="hover:text-orange-600 transition-colors cursor-pointer">
                  Cafes & Bakeries
                </span>
              </li>
              <li>
                <span className="hover:text-orange-600 transition-colors cursor-pointer">
                  Rooftop Bars & Lounges
                </span>
              </li>
              <li>
                <span className="hover:text-orange-600 transition-colors cursor-pointer">
                  Food Courts & QSRs
                </span>
              </li>
              <li>
                <span className="hover:text-orange-600 transition-colors cursor-pointer">
                  Hotel In-Room Dining
                </span>
              </li>
            </ul>
          </div>

          {/* Portal Links */}
          <div>
            <h4 className="text-xs font-bold text-zinc-950 uppercase tracking-wider mb-4">
              Access
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/login" className="hover:text-orange-600 transition-colors">
                  Manager Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-orange-600 transition-colors">
                  Register Restaurant
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} MeraResto Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-zinc-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-zinc-600 cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
