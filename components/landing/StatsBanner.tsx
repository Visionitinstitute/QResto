import { TrendingUp, Clock, Sparkles, ShieldCheck } from "lucide-react";

export function StatsBanner() {
  const stats = [
    {
      icon: TrendingUp,
      value: "+24%",
      label: "Average Check Size",
      sub: "Through visual dish previews and side recommendations",
    },
    {
      icon: Clock,
      value: "30%",
      label: "Faster Table Turnover",
      sub: "Guests browse and order the moment they sit down",
    },
    {
      icon: Sparkles,
      value: "0 sec",
      label: "Menu Wait Time",
      sub: "No waiting for waitstaff to bring paper menus",
    },
    {
      icon: ShieldCheck,
      value: "100%",
      label: "Zero Printing Cost",
      sub: "Update prices, specials & sold-out tags instantly",
    },
  ];

  return (
    <section className="py-6 sm:py-12 bg-white border-y border-zinc-100">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-3.5 sm:p-6 rounded-2xl bg-zinc-50/80 border border-zinc-200/80 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-emerald-600 mb-2.5 sm:mb-4 group-hover:scale-105 group-hover:bg-[#0B192C] group-hover:text-[#39ff14] transition-all shadow-2xs">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight font-sans">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-zinc-900 mt-0.5 sm:mt-1 leading-snug">
                    {stat.label}
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs text-zinc-500 mt-1 sm:mt-2 leading-relaxed">
                  {stat.sub}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
