import { Star, CheckCircle2 } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Balkumari",
      role: "Founder & Head Chef",
      restaurant: "Spice & Wood Bistro",
      city: "Connaught Place, New Delhi",
      quote:
        "Switching from paper menus to QResto completely changed our Friday dinner rush. Guests order drinks immediately after sitting, and our table turnover time decreased by 25 minutes per table. Our check averages jumped by 22% in our very first month.",
      metric: "+22% Higher Check Average",
      rating: 5,
    },
    {
      name: "Sangeeta",
      role: "Operations Director",
      restaurant: "The Amber Cafe & Roastery",
      city: "Indiranagar, Bengaluru",
      quote:
        "The best part is how effortless it is for customers. No QR app downloads, no registrations. They point their camera, see our aesthetic coffee and breakfast photos, and place orders. The kitchen tickets ring through cleanly without servers mishearing orders.",
      metric: "99.8% Order Accuracy",
      rating: 5,
    },
    {
      name: "Basanti",
      role: "General Manager",
      restaurant: "Urban Tadka Lounge",
      city: "Bandra West, Mumbai",
      quote:
        "Whenever a dessert or signature cocktail runs out on a busy Saturday night, we mark it out-of-stock from our smartphone in 3 seconds. No awkward waiter apologies or reprinted paper inserts. QResto paid for itself tenfold in printing savings alone.",
      metric: "₹1,20,000 Saved on Printing",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100/80 px-3 py-1 rounded-full">
            Real Partner Stories
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight mt-4">
            Loved by leading restaurants, cafes & rooftop bars
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600">
            Hear how hospitality operators use QResto to speed up service, boost diner spend, and simplify kitchen logistics.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          in          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-zinc-200/90 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/5 transition-all flex flex-col justify-between relative group"
            >
              <div>
                {/* Metric Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(item.rating)].map((_, rIdx) => (
                      <Star
                        key={rIdx}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-orange-700 bg-orange-50 border border-orange-200/80 px-2.5 py-1 rounded-lg">
                    {item.metric}
                  </span>
                </div>

                <p className="text-sm text-zinc-700 leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author Box */}
              <div className="mt-8 pt-5 border-t border-zinc-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-zinc-950 text-sm">
                      {item.name}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <p className="text-xs text-zinc-500">
                    {item.role} • <span className="text-zinc-700 font-medium">{item.restaurant}</span>
                  </p>
                  <p className="text-[11px] text-zinc-400">{item.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
