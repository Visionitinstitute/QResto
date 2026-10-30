import { TrendingUp, Clock, Sparkles, ShieldCheck } from "lucide-react";

export function StatsBanner() {
  const stats = [
    {
      icon: TrendingUp,
      value: "+24%",
      label: "Average Check Size",
      sub: "Through visual dish previews and automatic side recommendations",
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
    <section className="py-8 sm:py-12 bg-white border-y border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-zinc-50/70 border border-zinc-200/70 hover:border-orange-200 hover:bg-orange-50/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight font-sans">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-zinc-900 mt-1">
                  {stat.label}
                </div>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
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
