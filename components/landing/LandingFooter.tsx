import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white pt-10 sm:pt-16 pb-8 sm:pb-12 text-zinc-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-zinc-100">
          {/* Brand Info - full width on mobile */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 space-y-3.5">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0B192C] border border-[#39ff14]/40 flex items-center justify-center text-white shadow-md shadow-[#39ff14]/15">
                <UtensilsCrossed className="w-5 h-5 text-[#39ff14]" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold tracking-tight text-[#0B192C]">
                  Mera<span className="text-emerald-600">Resto</span>
                </span>
                <span className="text-[10px] font-bold bg-[#0B192C] text-[#39ff14] border border-[#39ff14]/40 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  SaaS
                </span>
              </div>
            </Link>

            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
              The modern digital menu and QR table ordering platform designed to speed up service, boost check sizes, and eliminate paper printing costs for restaurants, cafes, and bars.
            </p>

            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="w-2 h-2 rounded-full bg-[#39ff14] shadow-[0_0_8px_#39ff14] animate-pulse" />
              <span className="text-xs font-semibold text-zinc-800">
                All Systems Operational
              </span>
              <span className="text-zinc-300">•</span>
              <span className="text-xs text-zinc-400">Next.js 16 + Supabase</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="col-span-1">
            <h4 className="text-xs font-bold text-zinc-950 uppercase tracking-wider mb-3 sm:mb-4">
              Product
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs">
              <li>
                <a href="#features" className="hover:text-emerald-700 transition-colors">
                  QR Code Generator
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-700 transition-colors">
                  Kitchen Display (KDS)
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-700 transition-colors">
                  Dietary Badges
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-700 transition-colors">
                  Upsell Engine
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-emerald-700 transition-colors">
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Solutions Links */}
          <div className="col-span-1">
            <h4 className="text-xs font-bold text-zinc-950 uppercase tracking-wider mb-3 sm:mb-4">
              Solutions
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs">
              <li>
                <span className="hover:text-emerald-700 transition-colors cursor-pointer">
                  Casual Dining
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-700 transition-colors cursor-pointer">
                  Cafes & Bakeries
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-700 transition-colors cursor-pointer">
                  Rooftop Bars
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-700 transition-colors cursor-pointer">
                  Food Courts
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-700 transition-colors cursor-pointer">
                  Hotel Dining
                </span>
              </li>
            </ul>
          </div>

          {/* Portal Links */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-xs font-bold text-zinc-950 uppercase tracking-wider mb-3 sm:mb-4">
              Access
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs flex sm:flex-col gap-4 sm:gap-0">
              <li>
                <Link href="/login" className="hover:text-emerald-700 transition-colors font-medium">
                  Manager Sign In →
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-emerald-700 transition-colors font-medium">
                  Register Restaurant →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-zinc-400 text-center sm:text-left">
          <p>© {new Date().getFullYear()} MeraResto Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="hover:text-zinc-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-zinc-600 cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
