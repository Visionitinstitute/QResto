import Link from "next/link";
import { MapPin, QrCode, ArrowRight, Utensils, Star } from "lucide-react";

interface HotelData {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  logo_url: string | null;
}

interface PartnerVenuesProps {
  hotels: HotelData[];
}

export function PartnerVenues({ hotels }: PartnerVenuesProps) {
  return (
    <section id="restaurants" className="py-20 bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100/80 px-3 py-1 rounded-full">
              Live Network
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight mt-3">
              Featured Partner Restaurants
            </h2>
            <p className="text-sm text-zinc-600 mt-1">
              Select a venue to test their live digital menu or order straight from Table 1.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-zinc-700 bg-zinc-100 px-3.5 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{hotels.length} Active Venue{hotels.length > 1 ? "s" : ""} on QResto</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="rounded-3xl border border-zinc-200/90 p-6 bg-white hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/5 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-950 text-base group-hover:text-orange-600 transition-colors">
                        {hotel.name}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold mt-0.5">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>4.9 (Verified Venue)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {hotel.address && (
                  <p className="text-xs text-zinc-500 flex items-start gap-1.5 leading-relaxed mt-2">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{hotel.address}</span>
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 mt-4 text-[11px] font-semibold">
                  <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200/60">
                    Live Digital Menu
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    Instant Kitchen KDS
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-2.5">
                <Link
                  href={`/menu/${hotel.slug}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-colors shadow-xs"
                >
                  <span>Open Menu</span>
                  <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                </Link>

                <Link
                  href={`/menu/${hotel.slug}?table=1`}
                  className="inline-flex items-center justify-center gap-1.5 border border-zinc-200 hover:border-orange-200 hover:bg-orange-50/50 text-zinc-800 font-bold text-xs py-2.5 px-3.5 rounded-xl transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5 text-orange-600" />
                  <span>Table 1</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
