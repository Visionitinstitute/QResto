"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, QrCode } from "lucide-react";

interface HotelOption {
  name: string;
  slug: string;
  address?: string | null;
}

interface QuickMenuFinderProps {
  hotels: HotelOption[];
}

export function QuickMenuFinder({ hotels }: QuickMenuFinderProps) {
  const router = useRouter();
  const [tableNo, setTableNo] = useState("");
  const [selectedSlug, setSelectedSlug] = useState(hotels[0]?.slug || "royal-spice");

  const handleOpenMenu = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = selectedSlug || "royal-spice";
    const tableParam = tableNo ? `?table=${encodeURIComponent(tableNo)}` : "";
    router.push(`/menu/${slug}${tableParam}`);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl border border-zinc-200/80 shadow-sm p-4 sm:p-5">
      <form onSubmit={handleOpenMenu} className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          <QrCode className="w-3.5 h-3.5 text-zinc-700" />
          <span>Access Table Menu Directly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          {/* Restaurant Selector */}
          <div className="sm:col-span-7">
            <select
              aria-label="Select Restaurant"
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-3.5 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-colors"
            >
              {hotels.map((h) => (
                <option key={h.slug} value={h.slug}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          {/* Table Number */}
          <div className="sm:col-span-2">
            <input
              type="number"
              min="1"
              max="999"
              placeholder="Table #"
              value={tableNo}
              onChange={(e) => setTableNo(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-3 py-2.5 text-center font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-colors"
            />
          </div>

          {/* Action */}
          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full min-h-[42px] bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Open Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-zinc-400 pt-1 gap-1 text-center sm:text-left">
          <span>Guests can also scan the QR code placed on their table</span>
          <span className="font-medium text-zinc-600">No install required</span>
        </div>
      </form>
    </div>
  );
}
