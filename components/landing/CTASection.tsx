import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-orange-200/40 to-amber-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 rounded-2xl sm:rounded-3xl p-6 sm:p-14 text-white text-center relative overflow-hidden shadow-2xl border border-zinc-800">
          {/* Subtle Orange Glow inside card */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-orange-600/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-semibold mb-5 sm:mb-6">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Join 500+ Top Restaurants & Cafes</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Ready to modernize your dining room and boost sales by 24%?
            </h2>

            <p className="mt-4 sm:mt-5 text-xs sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
              Set up your digital menu, download print-ready table QR codes, and start receiving orders straight to your kitchen in less than 5 minutes.
            </p>

            <div className="mt-6 sm:mt-8 flex items-center justify-center">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Start Your 14-Day Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-zinc-800/80 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>5-minute instant setup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Free printable table QR templates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
