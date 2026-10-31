import { QrCode, Smartphone, ChefHat, ArrowRight, CheckCircle2 } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: QrCode,
      title: "Set up menu & print table QRs",
      desc: "Upload your dishes, set categories, add photos, and generate printable high-res QR codes for all dining tables in 5 minutes.",
      bullets: [
        "Instant PDF export for acrylic stands & stickers",
        "Assigned table numbers automatically embedded",
        "Edit items & prices anytime without reprinting",
      ],
      tag: "5-Min Onboarding",
    },
    {
      num: "02",
      icon: Smartphone,
      title: "Guests scan, browse & order",
      desc: "Diners scan the table QR code with any smartphone camera. No app download or sign up. They browse vibrant visuals and send their order directly.",
      bullets: [
        "Opens in 0.8 seconds in mobile Safari/Chrome",
        "Veg/Non-veg tags, spice levels & allergen alerts",
        "Add cooking instructions & custom notes",
      ],
      tag: "Zero Wait Time",
    },
    {
      num: "03",
      icon: ChefHat,
      title: "Kitchen prepares & serves seamlessly",
      desc: "Kitchen dashboard rings with an audible alert. Orders appear with exact table numbers and timestamps for lightning-fast table fulfillment.",
      bullets: [
        "Live Kitchen Display System (KDS) integration",
        "Color-coded order timers reduce delays",
        "Server marks order served in 1 click",
      ],
      tag: "Zero Mix-Ups",
    },
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-20 bg-zinc-50 border-y border-zinc-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100/80 px-3 py-1 rounded-full">
            Effortless Workflow
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 tracking-tight mt-3 sm:mt-4">
            How MeraResto transforms your dining service in 3 steps
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-zinc-600">
            A frictionless flow engineered so your staff can focus on hospitality while technology handles the ordering.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all flex flex-col justify-between relative group"
              >
                {/* Step Top */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-orange-500 font-mono tracking-tight">
                      {step.num}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-2xs">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md mb-2 inline-block">
                    {step.tag}
                  </span>

                  <h3 className="text-xl font-bold text-zinc-950 tracking-tight">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                    {step.desc}
                  </p>

                  <ul className="mt-6 space-y-2.5 text-xs text-zinc-600 border-t border-zinc-100 pt-5">
                    {step.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-zinc-600">
                  <span>Step {step.num} of 03</span>
                  <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
