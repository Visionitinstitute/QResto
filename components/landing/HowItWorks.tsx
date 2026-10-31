import { QrCode, Smartphone, ChefHat, CheckCircle2 } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: QrCode,
      title: "Set up menu & print table QRs",
      desc: "Upload dishes, set categories, add photos, and generate printable high-res QR codes for all dining tables in 5 minutes.",
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
      desc: "Diners scan the table QR code with any smartphone camera. No app download or sign up. They browse vibrant visuals and send orders directly.",
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
      desc: "Kitchen dashboard rings with an audible chime. Orders appear with exact table numbers and timestamps for lightning-fast fulfillment.",
      bullets: [
        "Live Kitchen Display System (KDS) integration",
        "Color-coded order timers reduce delays",
        "Server marks order served in 1 click",
      ],
      tag: "Zero Mix-Ups",
    },
  ];

  return (
    <section id="how-it-works" className="py-10 sm:py-20 bg-zinc-50 border-y border-zinc-200/70">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-16">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#39ff14] bg-[#0B192C] px-3.5 py-1.5 rounded-full border border-[#39ff14]/40 shadow-xs">
            Effortless Workflow
          </span>
          <h2 className="text-2xl min-[400px]:text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight mt-2.5 sm:mt-4">
            How MeraResto transforms your dining service in 3 steps
          </h2>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-lg text-zinc-600 max-w-xl mx-auto">
            A frictionless flow engineered so your staff can focus on hospitality while technology handles the ordering.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-zinc-200 shadow-xs hover:shadow-xl hover:border-[#39ff14] hover:shadow-[#39ff14]/10 transition-all flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <span className="text-xl sm:text-2xl font-black text-[#0B192C] bg-[#39ff14] px-2.5 py-0.5 rounded-lg border border-[#39ff14] font-mono tracking-tight shadow-xs">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#0B192C] border border-[#39ff14]/40 flex items-center justify-center text-[#39ff14] group-hover:bg-[#39ff14] group-hover:text-[#0B192C] transition-all shadow-xs">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>

                  <span className="text-[10px] sm:text-[11px] font-bold text-zinc-950 bg-[#39ff14]/20 border border-[#39ff14]/40 px-2 py-0.5 rounded-md mb-2 inline-block">
                    {step.tag}
                  </span>

                  <h3 className="text-base sm:text-xl font-bold text-zinc-950 tracking-tight">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    {step.desc}
                  </p>

                  <ul className="mt-4 sm:mt-6 space-y-2 text-xs text-zinc-600 border-t border-zinc-100 pt-4">
                    {step.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
