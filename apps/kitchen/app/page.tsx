"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ChefHat,
  Clock,
  CheckCircle2,
  Volume2,
  VolumeX,
  RefreshCw,
  Flame,
  Check,
  AlertCircle,
  Maximize2,
  History,
  X,
} from "lucide-react";
import { Modal } from "@meraresto/ui";

interface KitchenOrderItem {
  id: string;
  name: string;
  quantity: number;
  special?: string;
  completed?: boolean;
}

interface KitchenOrder {
  id: string;
  table: string;
  minutesAgo: number;
  status: "NEW" | "PREPARING" | "READY" | "SERVED";
  notes?: string;
  items: KitchenOrderItem[];
}

const INITIAL_ORDERS: KitchenOrder[] = [
  {
    id: "ORD-1094",
    table: "Table 5",
    minutesAgo: 1,
    status: "NEW",
    notes: "No onions, extra spicy",
    items: [
      { id: "i1", name: "Paneer Butter Masala", quantity: 1, special: "Extra spicy" },
      { id: "i2", name: "Butter Garlic Naan", quantity: 3 },
    ],
  },
  {
    id: "ORD-1093",
    table: "Table 2",
    minutesAgo: 6,
    status: "PREPARING",
    items: [
      { id: "i3", name: "Murgh Tikka Masala", quantity: 1 },
      { id: "i4", name: "Tandoori Roti", quantity: 4 },
      { id: "i5", name: "Crispy Corn & Salt Pepper", quantity: 1 },
    ],
  },
  {
    id: "ORD-1092",
    table: "Table 1",
    minutesAgo: 14,
    status: "PREPARING",
    notes: "Serve with extra lemons",
    items: [
      { id: "i6", name: "Veg Dum Biryani", quantity: 2 },
      { id: "i7", name: "Boondi Raita", quantity: 1 },
    ],
  },
  {
    id: "ORD-1091",
    table: "Table 4",
    minutesAgo: 19,
    status: "READY",
    items: [
      { id: "i8", name: "Masala Chai", quantity: 2 },
      { id: "i9", name: "Gulab Jamun with Ice Cream", quantity: 2 },
    ],
  },
];

export default function KitchenDisplayPage() {
  const [orders, setOrders] = useState<KitchenOrder[]>(INITIAL_ORDERS);
  const [completedHistory, setCompletedHistory] = useState<KitchenOrder[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "NEW" | "PREPARING" | "READY">("ALL");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Increment order timers every 60 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((prev) =>
        prev.map((o) => ({ ...o, minutesAgo: o.minutesAgo + 1 }))
      );
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Audio synthesizer chime for kitchen alerts
  const playAlertChime = useCallback(() => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3); // G5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    } catch {}
  }, [soundEnabled]);

  const updateStatus = async (
    orderId: string,
    nextStatus: "PREPARING" | "READY" | "SERVED"
  ) => {
    if (nextStatus === "SERVED") {
      const servedOrder = orders.find((o) => o.id === orderId);
      if (servedOrder) {
        setCompletedHistory((prev) => [
          { ...servedOrder, status: "SERVED" },
          ...prev.slice(0, 19),
        ]);
      }
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
      );
    }

    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: nextStatus }),
      });
    } catch {}
  };

  const toggleItemCompleted = (orderId: string, itemId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          items: ord.items.map((it) =>
            it.id === itemId ? { ...it, completed: !it.completed } : it
          ),
        };
      })
    );
  };

  const toggleFullscreen = () => {
    if (typeof document !== "undefined") {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === "ALL") return true;
    return o.status === filter;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans select-none">
      {/* Top Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/95 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0E8388] text-white shadow-md">
            <ChefHat className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-wide text-white uppercase leading-none">
              MeraResto KDS
            </h1>
            <span className="text-[11px] text-zinc-400 font-medium">
              Balkumari Cafe • Main Kitchen Screen
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-zinc-800/90 p-1 rounded-xl">
          {(["ALL", "NEW", "PREPARING", "READY"] as const).map((tab) => {
            const count =
              tab === "ALL"
                ? orders.length
                : orders.filter((o) => o.status === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === tab
                    ? "bg-[#0E8388] text-white shadow-xs"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        {/* Clock & Action Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-300 bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700">
            <Clock className="h-3.5 w-3.5 text-[#0E8388]" />
            {currentTime || "--:--:--"}
          </div>

          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playAlertChime();
            }}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors"
            title="Toggle Sound Alert"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="h-4 w-4 text-emerald-400" />
                <span className="hidden sm:inline">Sound ON</span>
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4 text-zinc-500" />
                <span className="hidden sm:inline">Muted</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors"
            title="Completed Order History"
          >
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Recent</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-zinc-300 hover:bg-zinc-700 transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Ticket Grid */}
      <main className="flex-1 p-6 overflow-y-auto">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-zinc-500">
            <CheckCircle2 className="h-16 w-16 text-[#0E8388] mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-zinc-200">
              Kitchen Display is All Clear
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              New customer orders from tables will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredOrders.map((ord) => {
              const isUrgent = ord.minutesAgo >= 15;
              return (
                <div
                  key={ord.id}
                  className={`rounded-2xl border flex flex-col justify-between overflow-hidden shadow-xl transition-all ${
                    ord.status === "NEW"
                      ? "border-emerald-500/70 bg-zinc-900"
                      : ord.status === "PREPARING"
                      ? isUrgent
                        ? "border-rose-500 bg-zinc-900 ring-2 ring-rose-500/40"
                        : "border-amber-500/70 bg-zinc-900"
                      : "border-teal-500/70 bg-zinc-900"
                  }`}
                >
                  {/* Card Header */}
                  <div
                    className={`p-4 border-b flex items-center justify-between ${
                      ord.status === "NEW"
                        ? "bg-emerald-950/50 border-emerald-900/60"
                        : ord.status === "PREPARING"
                        ? isUrgent
                          ? "bg-rose-950/50 border-rose-900/60 animate-pulse"
                          : "bg-amber-950/50 border-amber-900/60"
                        : "bg-teal-950/50 border-teal-900/60"
                    }`}
                  >
                    <div>
                      <span className="text-lg font-extrabold text-white">
                        {ord.table}
                      </span>
                      <span className="text-xs text-zinc-400 block font-mono">
                        #{ord.id}
                      </span>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold ${
                          isUrgent ? "text-rose-400" : "text-zinc-300"
                        }`}
                      >
                        <Clock className="h-3.5 w-3.5" />
                        {ord.minutesAgo}m elapsed
                      </span>
                      <div className="mt-1">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                            ord.status === "NEW"
                              ? "bg-emerald-400 text-black"
                              : ord.status === "PREPARING"
                              ? isUrgent
                                ? "bg-rose-400 text-black font-extrabold"
                                : "bg-amber-400 text-black"
                              : "bg-teal-400 text-black"
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cooking Instructions Alert */}
                  <div className="p-4 flex-1 space-y-3">
                    {ord.notes && (
                      <div className="rounded-xl bg-amber-950/40 border border-amber-800/60 p-2.5 text-xs text-amber-200 flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                        <span className="font-semibold leading-tight">
                          Special Note: {ord.notes}
                        </span>
                      </div>
                    )}

                    {/* Items checklist */}
                    <div className="divide-y divide-zinc-800/80">
                      {ord.items.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => toggleItemCompleted(ord.id, item.id)}
                          className={`py-2.5 px-2 flex items-start justify-between text-xs rounded-lg cursor-pointer transition-colors ${
                            item.completed
                              ? "bg-zinc-800/40 line-through text-zinc-500 opacity-60"
                              : "hover:bg-zinc-800/50 text-zinc-100"
                          }`}
                        >
                          <div className="flex-1 pr-2">
                            <span className="font-bold text-sm block">
                              {item.name}
                            </span>
                            {item.special && (
                              <p className="text-[11px] text-amber-300 italic">
                                * {item.special}
                              </p>
                            )}
                          </div>
                          <span className="font-mono font-black text-sm bg-zinc-800 text-teal-300 px-2.5 py-1 rounded-md shrink-0">
                            ×{item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Action Button */}
                  <div className="p-3.5 bg-zinc-900 border-t border-zinc-800">
                    {ord.status === "NEW" && (
                      <button
                        onClick={() => updateStatus(ord.id, "PREPARING")}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 py-3 text-xs font-extrabold uppercase tracking-wide transition-colors"
                      >
                        <Flame className="h-4 w-4" />
                        Start Preparation
                      </button>
                    )}

                    {ord.status === "PREPARING" && (
                      <button
                        onClick={() => updateStatus(ord.id, "READY")}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 py-3 text-xs font-extrabold uppercase tracking-wide transition-colors"
                      >
                        <Check className="h-4 w-4" />
                        Mark as Ready for Pickup
                      </button>
                    )}

                    {ord.status === "READY" && (
                      <button
                        onClick={() => updateStatus(ord.id, "SERVED")}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-3 text-xs font-extrabold uppercase tracking-wide transition-colors"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Served & Clear Ticket
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Recent History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl text-zinc-100 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History className="h-5 w-5 text-[#0E8388]" />
                Recently Completed Orders
              </h3>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 divide-y divide-zinc-800 text-xs">
              {completedHistory.length === 0 ? (
                <p className="text-zinc-500 text-center py-6">
                  No completed orders yet during this session.
                </p>
              ) : (
                completedHistory.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm">
                        {item.table}
                      </span>
                      <span className="text-zinc-400 block font-mono">
                        #{item.id}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      SERVED
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
