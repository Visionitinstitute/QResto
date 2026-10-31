import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-12 sm:py-20 bg-white relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] bg-gradient-to-tr from-emerald-200/30 to-[#39ff14]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0B192C] via-[#0f233d] to-[#07101c] rounded-2xl sm:rounded-3xl p-6 sm:p-14 text-white text-center relative overflow-hidden shadow-2xl border border-zinc-800">
          {/* Subtle Brand Glow inside card */}
          <div className="absolute -top-24 -right-24 w-60 sm:w-72 h-60 sm:h-72 bg-[#39ff14]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 sm:w-72 h-60 sm:h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#39ff14]/15 border border-[#39ff14]/30 text-[#39ff14] text-[11px] sm:text-xs font-semibold mb-4 sm:mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#39ff14]" />
              <span>Join 500+ Top Restaurants & Cafes</span>
            </div>

            <h2 className="text-xl min-[400px]:text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Ready to modernize your dining room and boost sales by 24%?
            </h2>

            <p className="mt-3 sm:mt-5 text-xs sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
              Set up your digital menu, download print-ready table QR codes, and start receiving orders straight to your kitchen in less than 5 minutes.
            </p>

            <div className="mt-6 sm:mt-8 flex items-center justify-center">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#39ff14] hover:bg-[#32e010] text-[#0B192C] font-black text-xs sm:text-sm px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl transition-all shadow-lg shadow-[#39ff14]/25 hover:shadow-[#39ff14]/40 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Start Your 14-Day Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-7 sm:mt-10 pt-5 sm:pt-8 border-t border-zinc-800/80 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-zinc-400">
              <div className="flex items-center gap-1.5 sm:gap-2 justify-center">
                <CheckCircle2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#39ff14] shrink-0" />
                <span>No card required</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 justify-center">
                <CheckCircle2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#39ff14] shrink-0" />
                <span>5-min setup</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 justify-center">
                <CheckCircle2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#39ff14] shrink-0" />
                <span>Printable QR PDF</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 justify-center">
                <CheckCircle2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#39ff14] shrink-0" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
