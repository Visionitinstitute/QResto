import {
  TrendingUp,
  Users,
  ChefHat,
  HeartHandshake,
  XCircle,
  CheckCircle2,
  Sparkles,
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
      "Staff focuses on hospitality & faster drink delivery, not order-taking",
      "Crystal clear digital tickets sent straight to Kitchen Display System",
      "Guests order immediately upon sitting, reducing table turnover time by 30%",
      "Automated smart upselling recommendations boost average check size by 24%",
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
    <section id="benefits" className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#39ff14] bg-[#0B192C] px-3.5 py-1.5 rounded-full border border-[#39ff14]/40 shadow-xs">
            Proven ROI & Impact
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 tracking-tight mt-3 sm:mt-4">
            Why leading restaurants are retiring paper menus forever
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-zinc-600">
            See how upgrading to MeraResto creates a win-win for your bottom line, kitchen efficiency, and guest happiness.
          </p>
        </div>

        {/* Side-by-Side Comparison Box */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {/* Traditional Way */}
          <div className="bg-zinc-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-zinc-200">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">
                ✕
              </div>
              <h3 className="text-lg font-bold text-zinc-900">
                Traditional Paper Menus
              </h3>
            </div>

            <ul className="space-y-4">
              {comparison.traditional.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-zinc-600">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* MeraResto Way */}
          <div className="bg-gradient-to-b from-[#39ff14]/10 via-emerald-50/15 to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-[#39ff14] shadow-xl shadow-[#39ff14]/10 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0B192C] text-[#39ff14] border border-[#39ff14]/40 flex items-center justify-center font-bold">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-zinc-950">
                  With MeraResto Digital Platform
                </h3>
              </div>
              <div className="bg-[#0B192C] text-[#39ff14] border border-[#39ff14]/40 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-xs shrink-0">
                <Sparkles className="w-3 h-3 text-[#39ff14]" />
                <span>Modern Standard</span>
              </div>
            </div>

            <ul className="space-y-4">
              {comparison.meraresto.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-zinc-800 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4 Persona Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {personas.map((persona, idx) => {
            const Icon = persona.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-zinc-200/90 hover:border-[#39ff14] hover:shadow-lg hover:shadow-[#39ff14]/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0B192C] border border-[#39ff14]/40 text-[#39ff14] flex items-center justify-center mb-4 group-hover:bg-[#39ff14] group-hover:text-[#0B192C] transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-zinc-950 bg-[#39ff14]/20 border border-[#39ff14]/40 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {persona.tag}
                </span>
                <h4 className="text-base font-bold text-zinc-950 mt-2">
                  {persona.title}
                </h4>
                <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
                  {persona.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
