"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Sparkles,
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle2,
  Clock,
  Flame,
  ArrowRight,
  TrendingUp,
  Scan,
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  isVeg: boolean;
  category: "all" | "starters" | "mains" | "drinks";
  popular?: boolean;
}

const SAMPLE_ITEMS: MenuItem[] = [
  {
    id: "item-1",
    name: "Tandoori Paneer Tikka",
    desc: "Cottage cheese cubes marinated in Kashmiri chili and curd, clay-oven roasted",
    price: 280,
    isVeg: true,
    category: "starters",
    popular: true,
  },
  {
    id: "item-2",
    name: "Dal Makhani Deluxe",
    desc: "Slow simmered black lentils infused with churned butter and smoked cream",
    price: 290,
    isVeg: true,
    category: "mains",
    popular: true,
  },
  {
    id: "item-3",
    name: "Virgin Mint Mojito",
    desc: "Fresh crushed garden mint, citrus lime wedges, sparkling fizz",
    price: 150,
    isVeg: true,
    category: "drinks",
  },
];

export function HeroMockup() {
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "starters" | "mains" | "drinks"
  >("all");
  const [cart, setCart] = useState<{ [id: string]: number }>({
    "item-1": 1,
    "item-3": 1,
  });
  const [orderSent, setOrderSent] = useState(false);

  const addItem = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeItem = (id: string) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[id] > 1) {
        updated[id] -= 1;
      } else {
        delete updated[id];
      }
      return updated;
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = SAMPLE_ITEMS.find((i) => i.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const filteredItems =
    selectedCategory === "all"
      ? SAMPLE_ITEMS
      : SAMPLE_ITEMS.filter((item) => item.category === selectedCategory);

  const handlePlaceOrder = () => {
    setOrderSent(true);
    setTimeout(() => {
      setOrderSent(false);
    }, 3500);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto py-8">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-[#39ff14]/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: QR Code Standee Preview & Real Scanner Card */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B192C] border border-[#39ff14]/40 text-[#39ff14] text-xs font-semibold shadow-xs">
            <Scan className="w-4 h-4 text-[#39ff14] animate-pulse" />
            <span>Interactive Table QR Experience</span>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight leading-snug">
              Scan with your phone to test the guest experience
            </h3>
            <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
              No app download or sign-up needed. Diners instantly view your menu, choose add-ons, and place orders directly to the kitchen.
            </p>
          </div>

          {/* Real QR Card on Acrylic Stand Mockup */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-zinc-200/60 border border-zinc-200/90 relative group hover:border-[#39ff14] hover:shadow-xl hover:shadow-[#39ff14]/10 transition-all max-w-xs w-full text-center">
            {/* Stand Clip Accent */}
            <div className="w-12 h-2.5 bg-zinc-300 rounded-full mx-auto -mt-8 mb-5 shadow-xs" />

            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4">
              <span className="text-xs font-bold text-zinc-900 tracking-wider uppercase">
                Table #04
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Active Session
              </span>
            </div>

            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 flex items-center justify-center relative">
              <QRCodeSVG
                value="https://menu.meraresto.in/royal-spice?table=4"
                size={160}
                level="M"
                bgColor="#ffffff"
                fgColor="#0f172a"
                className="rounded-lg shadow-2xs"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-9 h-9 rounded-lg bg-[#0B192C] border border-[#39ff14]/40 text-[#39ff14] flex items-center justify-center shadow-md">
                  <Sparkles className="w-4 h-4 text-[#39ff14]" />
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs font-bold text-zinc-900">
              Point your phone camera here to scan
            </p>
          </div>

          {/* Social Proof Stat */}
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-zinc-200 px-4 py-2.5 rounded-2xl shadow-xs">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
              ✓
            </div>
            <div className="text-left text-xs">
              <span className="font-bold text-zinc-950 block">Instant Setup</span>
              <span className="text-zinc-500">Print QR standees directly from your dashboard</span>
            </div>
          </div>
        </div>

        {/* Right Column: High-Fidelity Mobile Screen Mockup */}
        <div className="lg:col-span-7 flex justify-center relative">
          {/* Floating Pill 1 (Top Left) */}
          <div className="hidden sm:flex absolute -top-4 -left-6 z-20 items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-zinc-200/80 shadow-lg shadow-zinc-900/5 animate-float">
            <div className="w-7 h-7 rounded-lg bg-[#0B192C] text-[#39ff14] border border-[#39ff14]/30 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-900">New Order Placed!</p>
              <p className="text-[10px] text-zinc-500">Table 4 • 2 items • ₹430</p>
            </div>
          </div>

          {/* Floating Pill 2 (Bottom Right) */}
          <div className="hidden sm:flex absolute -bottom-4 -right-4 z-20 items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-emerald-200/80 shadow-lg shadow-zinc-900/5 animate-float-delayed">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-900">+28% Avg Check Size</p>
              <p className="text-[10px] text-zinc-500">With high-res dish photos & upselling</p>
            </div>
          </div>

          {/* Phone Shell */}
          <div className="w-full max-w-[310px] sm:max-w-[350px] mx-auto bg-zinc-950 rounded-[40px] sm:rounded-[44px] p-2.5 sm:p-3 shadow-2xl shadow-zinc-950/20 border-4 border-zinc-800 relative ring-1 ring-zinc-700/50">
            {/* Speaker & Dynamic Island */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-5 bg-zinc-900 rounded-full flex items-center justify-center z-30">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 mr-2" />
              <div className="w-2 h-2 rounded-full bg-zinc-700" />
            </div>

            {/* Inner Mobile Screen */}
            <div className="bg-white rounded-[34px] overflow-hidden flex flex-col h-[580px] sm:h-[620px] select-none text-left relative">
              {/* Phone Status Bar */}
              <div className="pt-3 px-6 pb-1 flex justify-between items-center text-[11px] font-semibold text-zinc-800 bg-zinc-50/80">
                <span>9:41</span>
                <div className="flex items-center gap-1.5 text-zinc-600">
                  <span className="text-[10px]">5G</span>
                  <div className="w-4 h-2 border border-zinc-600 rounded-xs flex items-center p-0.5">
                    <div className="w-full h-full bg-zinc-600 rounded-2xs" />
                  </div>
                </div>
              </div>

              {/* Restaurant Header */}
              <div className="px-4 py-3 bg-gradient-to-b from-[#39ff14]/10 via-emerald-50/10 to-white border-b border-zinc-100">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold bg-[#0B192C] text-[#39ff14] border border-[#39ff14]/30 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    Table #04
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Kitchen Open
                  </span>
                </div>
                <h4 className="font-bold text-zinc-950 text-base mt-1.5 tracking-tight">
                  Royal Spice Bistro & Bar
                </h4>
                <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-zinc-400" /> Average prep: 12-15 mins
                </p>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-zinc-100 overflow-x-auto text-xs font-semibold bg-white scrollbar-none">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === "all"
                      ? "bg-[#0B192C] text-[#39ff14] border border-[#39ff14]/50 shadow-2xs"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  All Items
                </button>
                <button
                  onClick={() => setSelectedCategory("starters")}
                  className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === "starters"
                      ? "bg-[#0B192C] text-[#39ff14] border border-[#39ff14]/50 shadow-2xs"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  Starters
                </button>
                <button
                  onClick={() => setSelectedCategory("mains")}
                  className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === "mains"
                      ? "bg-[#0B192C] text-[#39ff14] border border-[#39ff14]/50 shadow-2xs"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  Mains
                </button>
                <button
                  onClick={() => setSelectedCategory("drinks")}
                  className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === "drinks"
                      ? "bg-[#0B192C] text-[#39ff14] border border-[#39ff14]/50 shadow-2xs"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  Drinks
                </button>
              </div>

              {/* Interactive Menu List */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {filteredItems.map((item) => {
                  const qty = cart[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl border border-zinc-100 bg-white hover:border-zinc-200 transition-all shadow-2xs flex flex-col justify-between gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 border border-emerald-600 flex items-center justify-center p-0.5 rounded-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            </span>
                            <span className="font-bold text-zinc-900 text-xs sm:text-sm">
                              {item.name}
                            </span>
                            {item.popular && (
                              <span className="text-[10px] font-bold text-[#0B192C] bg-[#39ff14] px-1.5 py-0.2 rounded-xs">
                                ★ Popular
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-zinc-50">
                        <span className="text-xs sm:text-sm font-extrabold text-zinc-950">
                          ₹{item.price}
                        </span>

                        {qty > 0 ? (
                          <div className="flex items-center gap-2 bg-[#0B192C] text-[#39ff14] border border-[#39ff14]/40 text-xs font-bold rounded-lg px-2 py-1 shadow-xs">
                            <button
                              onClick={() => removeItem(item.id)}
                              aria-label="Decrease quantity"
                              className="hover:opacity-80 p-0.5 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-1 min-w-[14px] text-center text-white">{qty}</span>
                            <button
                              onClick={() => addItem(item.id)}
                              aria-label="Increase quantity"
                              className="hover:opacity-80 p-0.5 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addItem(item.id)}
                            className="text-xs font-bold text-[#0B192C] bg-[#39ff14]/25 hover:bg-[#39ff14]/40 border border-[#39ff14]/50 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Confirmation Feedback Banner */}
              {orderSent && (
                <div className="absolute inset-x-4 bottom-20 bg-[#0B192C] border border-[#39ff14] text-[#39ff14] p-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200 z-30">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-[#39ff14]" />
                  <div className="text-xs">
                    <p className="font-bold text-white">Order Sent to Kitchen!</p>
                    <p className="text-[11px] text-[#39ff14]">Chef ticket printed for Table #04</p>
                  </div>
                </div>
              )}

              {/* Bottom Sticky Cart Tray inside Phone */}
              <div className="p-3.5 bg-zinc-950 text-white border-t border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#39ff14]" />
                    <span className="text-zinc-300 font-medium">
                      {totalItems > 0 ? `${totalItems} items selected` : "Cart is empty"}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-white">
                    ₹{totalPrice}
                  </span>
                </div>

                <button
                  disabled={totalItems === 0 || orderSent}
                  onClick={handlePlaceOrder}
                  className={`w-full py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md ${
                    totalItems > 0
                      ? "bg-[#39ff14] hover:bg-[#32e010] text-[#0B192C] cursor-pointer shadow-lg shadow-[#39ff14]/25 border border-[#39ff14]"
                      : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  }`}
                >
                  <span>{orderSent ? "Order Dispatched ✓" : "Send Order to Kitchen"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
