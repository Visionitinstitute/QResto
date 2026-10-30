"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, HelpCircle, ArrowRight } from "lucide-react";

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  const tiers = [
    {
      name: "Starter",
      badge: "For Cafes & Food Trucks",
      priceMonthly: 399,
      priceAnnual: 299,
      description:
        "Everything needed to digitize your tables, ditch paper menus, and accept table orders.",
      features: [
        "Up to 15 dining tables",
        "Unlimited menu items & categories",
        "High-res printable QR code PDFs",
        "Real-time instant price & 86 sync",
        "Standard mobile guest web menu",
        "Email support",
      ],
      cta: "Start 14-Day Free Trial",
      popular: false,
    },
    {
      name: "Pro Hospitality",
      badge: "Most Popular for Restaurants",
      priceMonthly: 699,
      priceAnnual: 499,
      description:
        "The complete powerhouse: KDS, upselling recommendations, analytics, and instant audio tickets.",
      features: [
        "Unlimited dining tables & patio seating",
        "Live Kitchen Display System (KDS) feed",
        "Smart automated upselling & drink combos",
        "Dietary & allergen filter tags",
        "Audible kitchen ticket chime",
        "Waiter & kitchen staff logins",
        "24/7 Priority WhatsApp & phone support",
      ],
      cta: "Get Started with Pro",
      popular: true,
    },
    {
      name: "Multi-Outlet Enterprise",
      badge: "Chains & Hotel Dining",
      priceMonthly: 1299,
      priceAnnual: 999,
      description:
        "Centralized menu management and deep integrations for restaurant groups with multiple branches.",
      features: [
        "Multi-branch master menu control",
        "Custom branding & white-label domain",
        "POS & thermal printer integration",
        "Advanced kitchen prep analytics",
        "Role-based staff permissions",
        "Dedicated hospitality account manager",
      ],
      cta: "Contact Enterprise Sales",
      popular: false,
    },
  ];

  const faqs = [
    {
      q: "Do my dining guests need to download an app?",
      a: "No! Guests simply open their default smartphone camera (iPhone or Android) and point it at the table QR code. The menu opens immediately in their mobile browser in under a second.",
    },
    {
      q: "Do I need to purchase expensive hardware or tablets?",
      a: "Not at all. You can run QResto's kitchen display and manager dashboard on any standard smartphone, tablet, iPad, or existing computer you already own.",
    },
    {
      q: "How do I print the QR codes for my restaurant tables?",
      a: "From your dashboard, click 'Export QR Stands'. QResto generates professional, print-ready PDF sheets pre-sized for acrylic table tents, wooden blocks, and stickers.",
    },
    {
      q: "Can I update item prices or mark dishes sold-out during service?",
      a: "Yes! Any change made in your dashboard reflects instantaneously on every guest's phone without them needing to refresh the page.",
    },
  ];

  return (
    <section id="pricing" className="py-14 sm:py-20 bg-zinc-50 border-y border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100/80 px-3 py-1 rounded-full">
            Transparent Pricing
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 tracking-tight mt-3 sm:mt-4">
            Simple, honest plans that scale with your tables
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-zinc-600">
            Start with a 14-day free trial. No credit card required. Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span
              className={`text-xs sm:text-sm font-semibold ${
                !isAnnual ? "text-zinc-950" : "text-zinc-500"
              }`}
            >
              Monthly Billing
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              aria-label="Toggle annual or monthly billing"
              className="w-13 sm:w-14 h-7 sm:h-8 bg-zinc-300 rounded-full p-1 transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <div
                className={`w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-orange-600 shadow-md transition-transform ${
                  isAnnual ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span
                className={`text-xs sm:text-sm font-semibold ${
                  isAnnual ? "text-zinc-950" : "text-zinc-500"
                }`}
              >
                Annual Billing
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                Save 25%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-14 sm:mb-20">
          {tiers.map((tier, idx) => {
            const price = isAnnual ? tier.priceAnnual : tier.priceMonthly;
            return (
              <div
                key={idx}
                className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                  tier.popular
                    ? "bg-white border-2 border-orange-500 shadow-xl shadow-orange-500/10 lg:-translate-y-2 ring-4 ring-orange-500/10"
                    : "bg-white border border-zinc-200 shadow-sm hover:shadow-md"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                    <span>MOST POPULAR CHOICE</span>
                  </div>
                )}

                <div>
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block">
                    {tier.badge}
                  </span>
                  <h3 className="text-2xl font-extrabold text-zinc-950 mt-1">
                    {tier.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-2 min-h-[36px] leading-relaxed">
                    {tier.description}
                  </p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-zinc-950 tracking-tight">
                      ₹{price}
                    </span>
                    <span className="text-xs font-medium text-zinc-500">
                      / month {isAnnual ? "(billed annually)" : ""}
                    </span>
                  </div>

                  <div className="mt-8 pt-6 border-t border-zinc-100 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      What&apos;s Included:
                    </p>
                    {tier.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-zinc-700">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6">
                  <Link
                    href="/signup"
                    className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
                      tier.popular
                        ? "bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/20 hover:shadow-md"
                        : "bg-zinc-900 hover:bg-zinc-800 text-white"
                    }`}
                  >
                    <span>{tier.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <p className="text-center text-[11px] text-zinc-400 mt-2">
                    14-day free trial • Cancel anytime
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQs Accordion */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-zinc-200/90 p-8 shadow-sm">
          <div className="text-center mb-8">
            <HelpCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-zinc-950">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Have questions about deploying QResto in your dining room?
            </p>
          </div>

          <div className="space-y-6 divide-y divide-zinc-100">
            {faqs.map((faq, idx) => (
              <div key={idx} className={idx > 0 ? "pt-6" : ""}>
                <h4 className="text-sm font-bold text-zinc-950 mb-2">
                  {faq.q}
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
