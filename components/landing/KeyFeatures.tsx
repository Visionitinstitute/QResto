import {
  QrCode,
  Flame,
  Zap,
  Smartphone,
  SlidersHorizontal,
  BellRing,
  Layers,
  Sparkles,
} from "lucide-react";

export function KeyFeatures() {
  const features = [
    {
      icon: QrCode,
      tag: "Hardware Free",
      title: "One-Click Printable Table QR Codes",
      description:
        "Generate unique, encrypted QR codes for each table. Download designer-ready PDF templates for table tents, acrylic blocks, or coasters.",
      badge: "Print & Go",
    },
    {
      icon: Zap,
      tag: "Live Updates",
      title: "Instant Menu & 86-Item Inventory Sync",
      description:
        "Ran out of avocado or special fish? Mark it sold out in 1 tap from your phone. Prices, descriptions, and daily specials update across all tables instantly.",
      badge: "Zero Latency",
    },
    {
      icon: Smartphone,
      tag: "Guest Friendly",
      title: "Zero App Download or Sign-Up",
      description:
        "No frustrating app store downloads, passwords, or intrusive permissions. Guests scan using their default camera and browse immediately.",
      badge: "Lightning Fast",
    },
    {
      icon: BellRing,
      tag: "Kitchen Operations",
      title: "Real-Time Kitchen Display & Audio Alerts",
      description:
        "Orders chime right into the kitchen display board with table numbers, cooking instructions, and allergen warnings organized neatly.",
      badge: "KDS Included",
    },
    {
      icon: SlidersHorizontal,
      tag: "Guest Delight",
      title: "Smart Dietary & Allergen Filters",
      description:
        "Clear Green/Red veg badges, spice level meters (mild to extra hot), vegan, dairy-free, and chef recommendation tags help customers order with confidence.",
      badge: "Dietary Precision",
    },
    {
      icon: Flame,
      tag: "Revenue Engine",
      title: "Automated Upselling & Combos",
      description:
        "QResto intelligently suggests pairing mocktails with spicy starters and desserts after main courses, expanding your average check size effortlessly.",
      badge: "+24% Revenue",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Engineered for Peak Service Hours</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight leading-tight">
            Everything your dining room needs to run smoother and earn more.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed">
            Eliminate server bottlenecks, reduce order mix-ups, and elevate the dining experience with an operating system built exclusively for hospitality.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative p-8 rounded-3xl bg-white border border-zinc-200/90 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white group-hover:scale-105 transition-all shadow-2xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-orange-700 bg-orange-100/70 px-2.5 py-1 rounded-lg">
                      {feature.badge}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider block mb-1">
                    {feature.tag}
                  </span>
                  <h3 className="text-xl font-bold text-zinc-950 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center text-xs font-semibold text-orange-600 group-hover:text-orange-700">
                  <span>Learn how it works &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
