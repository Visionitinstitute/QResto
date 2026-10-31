import { Star, CheckCircle2 } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Balkumari",
      role: "Founder & Head Chef",
      restaurant: "Spice & Wood Bistro",
      city: "Connaught Place, New Delhi",
      quote:
        "Switching from paper menus to MeraResto completely changed our Friday dinner rush. Guests order drinks immediately after sitting, and our table turnover time decreased by 25 minutes per table. Check averages jumped 22% in our very first month.",
      metric: "+22% Check Size",
      rating: 5,
    },
    {
      name: "Sangeeta",
      role: "Operations Director",
      restaurant: "The Amber Cafe & Roastery",
      city: "Indiranagar, Bengaluru",
      quote:
        "The best part is how effortless it is for customers. No QR app downloads, no registrations. They point their camera, see our aesthetic coffee and breakfast photos, and place orders. The kitchen tickets ring through cleanly without servers mishearing orders.",
      metric: "99.8% Accuracy",
      rating: 5,
    },
    {
      name: "Basanti",
      role: "General Manager",
      restaurant: "Urban Tadka Lounge",
      city: "Bandra West, Mumbai",
      quote:
        "Whenever a dessert or signature cocktail runs out on a busy Saturday night, we mark it out-of-stock from our smartphone in 3 seconds. No awkward waiter apologies or reprinted paper inserts. MeraResto paid for itself tenfold in printing savings alone.",
      metric: "₹1,20,000 Saved",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-10 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-16">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#39ff14] bg-[#0B192C] px-3.5 py-1.5 rounded-full border border-[#39ff14]/40 shadow-xs">
            Real Partner Stories
          </span>
          <h2 className="text-2xl min-[400px]:text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight mt-2.5 sm:mt-4">
            Loved by leading restaurants, cafes & rooftop bars
          </h2>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-lg text-zinc-600 max-w-xl mx-auto">
            Hear how hospitality operators use MeraResto to speed up service, boost diner spend, and simplify kitchen logistics.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-zinc-200/90 hover:border-[#39ff14] hover:shadow-xl hover:shadow-[#39ff14]/10 transition-all flex flex-col justify-between relative group"
            >
              <div>
                {/* Metric Badge */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(item.rating)].map((_, rIdx) => (
                      <Star
                        key={rIdx}
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-zinc-950 bg-[#39ff14]/20 border border-[#39ff14]/40 px-2 py-0.5 rounded-md">
                    {item.metric}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author Box */}
              <div className="mt-5 pt-3.5 sm:mt-6 sm:pt-4 border-t border-zinc-100 flex items-center gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0B192C] text-[#39ff14] border border-[#39ff14]/40 font-bold text-xs sm:text-sm flex items-center justify-center shadow-xs shrink-0">
                  {item.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-zinc-950 text-xs sm:text-sm truncate">
                      {item.name}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  </div>
                  <p className="text-[11px] text-zinc-500 truncate">
                    {item.role} • <span className="text-zinc-700 font-medium">{item.restaurant}</span>
                  </p>
                  <p className="text-[10px] text-zinc-400 truncate">{item.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
