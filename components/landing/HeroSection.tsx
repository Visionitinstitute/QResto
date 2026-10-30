import Link from "next/link";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { HeroMockup } from "@/components/landing/HeroMockup";
import { QuickMenuFinder } from "@/components/public/QuickMenuFinder";

interface HotelOption {
  id: string;
  name: string;
  slug: string;
  address?: string | null;
  phone?: string | null;
  logo_url?: string | null;
}

interface HeroSectionProps {
  hotels: HotelOption[];
}

export function HeroSection({ hotels }: HeroSectionProps) {
  return (
    <section className="relative pt-8 pb-14 sm:pt-16 sm:pb-28 overflow-hidden bg-white">
      {/* Subtle Warm Gradient Wash at Top */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-orange-50/60 via-amber-50/20 to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Top Content */}
        <div className="max-w-4xl mx-auto text-center">
          {/* Top Pill */}
          <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-orange-100/90 border border-orange-200/90 text-orange-800 text-[11px] sm:text-xs font-semibold mb-5 sm:mb-6 shadow-2xs hover:bg-orange-100 transition-colors">
            <span className="flex h-2 w-2 rounded-full bg-orange-600 animate-pulse" />
            <span>Digital Dining OS 2.0</span>
            <span className="text-orange-400">•</span>
            <span className="font-normal text-orange-950">Zero App Downloads Required</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-zinc-950 tracking-tight leading-[1.12] sm:leading-[1.08]">
            Turn Every Dining Table into a{" "}
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent underline decoration-orange-300 decoration-wavy decoration-from-font">
              Revenue Engine.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Delight hungry guests with interactive visual menus, instant table ordering, and real-time kitchen sync. Boost table turnover by 30% and eliminate paper menu costs forever.
          </p>

          {/* Primary Action Button */}
          <div className="mt-6 sm:mt-8 flex items-center justify-center px-2">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl transition-all shadow-lg shadow-orange-600/25 hover:shadow-orange-600/35 hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-orange-200" />
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust Checkmarks */}
          <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> No credit card needed
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Works on any smartphone camera
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Set up in 5 minutes
            </span>
          </div>

          {/* Table Finder Widget Box */}
          <div className="mt-10 max-w-xl mx-auto">
            <QuickMenuFinder hotels={hotels} />
          </div>
        </div>

        {/* Realistic Interactive QR Menu & Phone Mockup */}
        <div className="mt-14 sm:mt-20">
          <HeroMockup />
        </div>
      </div>
    </section>
  );
}
