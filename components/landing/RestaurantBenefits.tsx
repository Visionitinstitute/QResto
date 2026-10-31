import {
  TrendingUp,
  Users,
  ChefHat,
  HeartHandshake,
  XCircle,
  CheckCircle2,
} from "lucide-react";

export function RestaurantBenefits() {
  const comparison = {
    traditional: [
      "Costly reprints every time a price or seasonal dish changes",
      "Waiters overloaded running back and forth with order pads",
      "Illegible handwritten tickets cause kitchen misunderstandings",
      "Guests get frustrated waiting 10-15 mins just to place an order",
      "Zero customer data or insights into bestselling menu combinations",
    ],
    meraresto: [
      "100% real-time menu updates in seconds without reprinting costs",
      "Staff focuses on hospitality & faster delivery, not order-taking",
      "Crystal clear digital tickets sent straight to Kitchen Display System",
      "Guests order immediately upon sitting, reducing turnover time by 30%",
      "Automated smart upselling recommendations boost check size by 24%",
    ],
  };

  const personas = [
    {
      icon: TrendingUp,
      title: "For Owners & Operators",
      tag: "Higher Profitability",
      description:
        "Increase table turnover during peak rush hours, boost ticket sizes with automated visual upsells, and save thousands every quarter on printing costs.",
    },
    {
      icon: Users,
      title: "For Floor Waitstaff",
      tag: "Reduced Burnout",
      description:
        "Servers spend less energy sprinting across dining rooms with paper notepads and more time delighting guests, delivering food hot, and pouring beverages.",
    },
    {
      icon: ChefHat,
      title: "For Kitchen & Chefs",
      tag: "Flawless Execution",
      description:
        "Kitchen tickets are organized chronologically with explicit dietary requirements, spice requests, and exact table locations to stop mix-ups entirely.",
    },
    {
      icon: HeartHandshake,
      title: "For Dining Guests",
      tag: "Delightful Experience",
      description:
        "No waiting 15 minutes to flag down a busy waiter. Customers enjoy appetizing photos, allergen security, and transparent real-time order summaries.",
    },
  ];

  return (
    <section id="benefits" className="py-10 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-16">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#39ff14] bg-[#0B192C] px-3.5 py-1.5 rounded-full border border-[#39ff14]/40 shadow-xs">
            Proven ROI & Impact
          </span>
          <h2 className="text-2xl min-[400px]:text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight mt-2.5 sm:mt-4">
            Why leading restaurants are retiring paper menus forever
          </h2>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-lg text-zinc-600 max-w-xl mx-auto">
            See how upgrading to MeraResto creates a win-win for your bottom line, kitchen efficiency, and guest happiness.
          </p>
        </div>

        {/* Side-by-Side Comparison Box */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-16">
          {/* Traditional Way */}
          <div className="bg-zinc-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-zinc-200">
            <div className="flex items-center gap-2.5 mb-4 sm:mb-6">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs sm:text-sm">
                ✕
              </div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-900">
                Traditional Paper Menus
              </h3>
            </div>

            <ul className="space-y-3 sm:space-y-4">
              {comparison.traditional.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-600">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* MeraResto Way */}
          <div className="bg-gradient-to-b from-[#39ff14]/10 via-emerald-50/15 to-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border-2 border-[#39ff14] shadow-xl shadow-[#39ff14]/10 relative overflow-hidden">
            <div className="flex items-center gap-2.5 mb-4 sm:mb-6">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#0B192C] text-[#39ff14] border border-[#39ff14]/40 flex items-center justify-center font-bold text-xs sm:text-sm">
                ✓
              </div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-950">
                The MeraResto Platform
              </h3>
            </div>

            <ul className="space-y-3 sm:space-y-4">
              {comparison.meraresto.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-900 font-medium">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4 Personas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {personas.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-4 sm:p-6 rounded-2xl bg-zinc-50 border border-zinc-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-emerald-600 mb-3 shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                    {p.tag}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-zinc-950">
                    {p.title}
                  </h4>
                  <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
