import Link from "next/link";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { HeroMockup } from "@/components/landing/HeroMockup";

export function HeroSection() {
  return (
    <section className="relative pt-6 pb-10 sm:pt-16 sm:pb-24 overflow-hidden bg-white">
      {/* Subtle Warm Gradient Wash at Top */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#39ff14]/12 via-emerald-50/15 to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Hero Top Content */}
        <div className="max-w-4xl mx-auto text-center">
          {/* Top Pill */}
          <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#0B192C] border border-[#39ff14]/40 text-[#39ff14] text-[10px] sm:text-xs font-semibold mb-4 sm:mb-6 shadow-xs shadow-[#39ff14]/15">
            <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#39ff14] shadow-[0_0_8px_#39ff14] animate-pulse" />
            <span>Digital Dining OS 2.0</span>
            <span className="text-zinc-500">•</span>
            <span className="font-normal text-zinc-300">No App Downloads Needed</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-[28px] min-[360px]:text-3xl min-[480px]:text-4xl sm:text-5xl lg:text-7xl font-black text-[#0B192C] tracking-tight leading-[1.15] sm:leading-[1.08]">
            Turn Every Dining Table into a{" "}
            <span className="relative inline-block text-zinc-950">
              <span className="relative z-10">Revenue Engine.</span>
              <span className="absolute bottom-1.5 sm:bottom-3 left-0 right-0 h-2.5 sm:h-4 bg-[#39ff14] -rotate-1 rounded-xs -z-0 opacity-80" />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-3.5 sm:mt-6 text-xs min-[360px]:text-sm sm:text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Delight hungry guests with interactive visual menus, instant table ordering, and real-time kitchen sync. Boost table turnover by 30% and eliminate paper menu costs forever.
          </p>

          {/* Primary Action Button */}
          <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#39ff14] hover:bg-[#32e010] text-[#0B192C] font-black text-xs sm:text-sm px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-[#39ff14]/30 hover:shadow-xl hover:shadow-[#39ff14]/45 hover:-translate-y-0.5 cursor-pointer border border-[#39ff14]"
            >
              <Sparkles className="w-4 h-4 text-[#0B192C]" />
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-4 h-4 text-[#0B192C]" />
            </Link>
          </div>

          {/* Trust Checkmarks */}
          <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-6 gap-y-1.5 text-[11px] sm:text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> No credit card needed
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Any phone camera
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Set up in 5 minutes
            </span>
          </div>
        </div>

        {/* Realistic Interactive QR Menu & Phone Mockup */}
        <div className="mt-10 sm:mt-20">
          <HeroMockup />
        </div>
      </div>
    </section>
  );
}
