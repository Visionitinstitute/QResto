import React from "react";
import Link from "next/link";
import {
  QrCode,
  UtensilsCrossed,
  Layers,
  ChefHat,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const dashboardUrl =
    process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3001";
  const customerMenuUrl =
    process.env.NEXT_PUBLIC_MENU_URL || "http://localhost:3002";

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#0B192C]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0B192C] border border-[#39ff14]/40 text-white shadow-xs">
              <UtensilsCrossed className="h-5 w-5 text-[#39ff14]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#0B192C]">
                Mera<span className="text-emerald-600">Resto</span>
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
            <a href="#features" className="hover:text-emerald-700 transition-colors">Features</a>
            <a href="#kds" className="hover:text-emerald-700 transition-colors">Kitchen Display</a>
            <a href="#pricing" className="hover:text-emerald-700 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`${dashboardUrl}/login`}
              className="text-sm font-semibold text-zinc-700 hover:text-[#0B192C] px-3 py-1.5"
            >
              Sign In
            </a>
            <a
              href={`${dashboardUrl}/signup`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0B192C] border border-[#39ff14]/50 px-4 py-2 text-sm font-bold text-[#39ff14] shadow-sm hover:bg-black transition-colors"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#39ff14]/40 bg-[#0B192C] px-4 py-1.5 text-xs font-semibold text-[#39ff14] mb-6 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-[#39ff14]" />
            Next-Gen Restaurant Operating Platform
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-[#0B192C]">
            Your Restaurant, <br />
            <span className="relative inline-block text-zinc-950">
              <span className="relative z-10">Your Digital World.</span>
              <span className="absolute bottom-2 left-0 right-0 h-3 sm:h-4 bg-[#39ff14] -rotate-1 rounded-sm -z-0 opacity-80" />
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-zinc-600 leading-relaxed">
            Eliminate paper menus, accelerate table turns, and streamline kitchen
            workflows. MeraResto empowers independent restaurants and cloud kitchens
            with real-time QR ordering, instant KDS, and robust analytics.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`${dashboardUrl}/signup`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#39ff14] hover:bg-[#32e010] px-6 py-3.5 text-sm font-black text-[#0B192C] shadow-lg shadow-[#39ff14]/30 border border-[#39ff14] transition-all"
            >
              Start 14-Day Free Trial
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={`${customerMenuUrl}/demo?table=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              <QrCode className="h-4 w-4 text-emerald-600" />
              Experience Customer Menu Demo
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> No credit card required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Works on any smartphone camera
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Setup in under 5 minutes
            </span>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="border-t border-zinc-200/80 bg-white py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B192C]">
              Engineered for Speed, Clarity, and Reliability
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-600">
              Everything your staff and guests need to make dining smooth and delightful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-zinc-200 bg-[#fafaf9] p-7 transition-all hover:border-[#39ff14] hover:shadow-lg hover:shadow-[#39ff14]/10">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B192C] text-[#39ff14] border border-[#39ff14]/30 shadow-xs">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-[#0B192C]">Smart Table QR Codes</h3>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                Generate high-resolution printable QR codes per dining table. Guests scan to view live menus and order without downloading any app.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-[#fafaf9] p-7 transition-all hover:border-[#39ff14] hover:shadow-lg hover:shadow-[#39ff14]/10">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B192C] text-[#39ff14] border border-[#39ff14]/30 shadow-xs">
                <ChefHat className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-[#0B192C]">Real-Time Kitchen Display</h3>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                Orders appear instantly on kitchen screens with sound alerts, preparation status toggles, and special cooking instructions.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-[#fafaf9] p-7 transition-all hover:border-[#39ff14] hover:shadow-lg hover:shadow-[#39ff14]/10">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B192C] text-[#39ff14] border border-[#39ff14]/30 shadow-xs">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-[#0B192C]">Sales & Menu Insights</h3>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                Track top-selling items, revenue per table, peak hour traffic, and inventory toggles directly from your manager dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-[#fafaf9]">
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B192C]">
              Transparent, Simple Pricing
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Grow from a single food truck to a busy multi-chain restaurant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-xs">
              <h3 className="text-lg font-bold text-zinc-900">Starter</h3>
              <p className="mt-1 text-xs text-zinc-500">Perfect for testing and small cafes</p>
              <div className="mt-4 text-3xl font-extrabold text-zinc-900">₹0 <span className="text-xs font-normal text-zinc-500">/ forever</span></div>
              <ul className="mt-6 space-y-3 text-xs text-zinc-600">
                <li className="flex items-center gap-2">✓ Up to 10 tables</li>
                <li className="flex items-center gap-2">✓ Digital QR Menu</li>
                <li className="flex items-center gap-2">✓ Standard order management</li>
                <li className="flex items-center gap-2">✓ Community support</li>
              </ul>
              <a
                href={`${dashboardUrl}/signup`}
                className="mt-8 block text-center rounded-xl border border-zinc-300 py-2.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                Sign Up Free
              </a>
            </div>

            {/* Pro */}
            <div className="relative rounded-2xl border-2 border-[#39ff14] ring-4 ring-[#39ff14]/15 bg-white p-7 shadow-xl shadow-[#39ff14]/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0B192C] text-[#39ff14] border border-[#39ff14]/50 px-3 py-0.5 text-[11px] font-black uppercase tracking-wider shadow-sm">
                Most Popular
              </div>
              <h3 className="text-lg font-bold text-zinc-900">Pro Resto</h3>
              <p className="mt-1 text-xs text-zinc-500">For active dine-in & bar restaurants</p>
              <div className="mt-4 text-3xl font-extrabold text-[#0B192C]">₹999 <span className="text-xs font-normal text-zinc-500">/ month</span></div>
              <ul className="mt-6 space-y-3 text-xs text-zinc-700">
                <li className="flex items-center gap-2 font-medium">✓ Unlimited tables & QR codes</li>
                <li className="flex items-center gap-2 font-medium">✓ Live Kitchen Display (KDS)</li>
                <li className="flex items-center gap-2 font-medium">✓ Sound alerts & auto-print</li>
                <li className="flex items-center gap-2 font-medium">✓ Item variants & add-ons</li>
                <li className="flex items-center gap-2 font-medium">✓ Priority WhatsApp support</li>
              </ul>
              <a
                href={`${dashboardUrl}/signup?plan=pro`}
                className="mt-8 block text-center rounded-xl bg-[#39ff14] hover:bg-[#32e010] py-2.5 text-xs font-black text-[#0B192C] shadow-md shadow-[#39ff14]/30 border border-[#39ff14] transition-all"
              >
                Start Pro Trial
              </a>
            </div>

            {/* Enterprise */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-xs">
              <h3 className="text-lg font-bold text-zinc-900">Enterprise</h3>
              <p className="mt-1 text-xs text-zinc-500">Multi-outlet chains & franchises</p>
              <div className="mt-4 text-3xl font-extrabold text-zinc-900">₹2,499 <span className="text-xs font-normal text-zinc-500">/ month</span></div>
              <ul className="mt-6 space-y-3 text-xs text-zinc-600">
                <li className="flex items-center gap-2">✓ Multi-outlet centralized billing</li>
                <li className="flex items-center gap-2">✓ Custom domain branding</li>
                <li className="flex items-center gap-2">✓ Staff RBAC & pin logins</li>
                <li className="flex items-center gap-2">✓ Dedicated account manager</li>
              </ul>
              <a
                href={`${dashboardUrl}/signup?plan=enterprise`}
                className="mt-8 block text-center rounded-xl border border-zinc-300 py-2.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200/80 bg-white py-10 px-6 text-center text-xs text-zinc-500">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} MeraResto Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-zinc-900">Features</a>
            <a href="#pricing" className="hover:text-zinc-900">Pricing</a>
            <a href={`${dashboardUrl}/login`} className="hover:text-zinc-900">Dashboard</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

