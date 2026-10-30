"use client";

import React, { useState, useCallback } from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  ChefHat,
  Volume2,
  VolumeX,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from "@meraresto/ui";
import { formatCurrency } from "@meraresto/utils";

interface DashboardOrder {
  id: string;
  orderNumber: string;
  tableNumber: string;
  customerName?: string;
  customerPhone?: string;
  items: Array<{ name: string; quantity: number; special?: string; price: number }>;
  subtotal: number;
  totalAmount: number;
  status: "PENDING" | "ACCEPTED" | "PREPARING" | "READY" | "SERVED" | "CANCELLED";
  createdAt: string;
  specialInstructions?: string;
}

const INITIAL_ORDERS: DashboardOrder[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-1094",
    tableNumber: "5",
    items: [
      { name: "Paneer Butter Masala", quantity: 1, price: 320 },
      { name: "Butter Garlic Naan", quantity: 3, price: 65 },
    ],
    subtotal: 515,
    totalAmount: 540,
    status: "PREPARING",
    createdAt: "3 mins ago",
    specialInstructions: "Less spicy please",
  },
  {
    id: "ord-2",
    orderNumber: "ORD-1093",
    tableNumber: "2",
    items: [
      { name: "Murgh Tikka Masala", quantity: 1, price: 380 },
      { name: "Tandoori Roti", quantity: 4, price: 20 },
    ],
    subtotal: 460,
    totalAmount: 483,
    status: "READY",
    createdAt: "8 mins ago",
  },
  {
    id: "ord-3",
    orderNumber: "ORD-1092",
    tableNumber: "1",
    items: [
      { name: "Veg Dum Biryani", quantity: 2, price: 220 },
      { name: "Boondi Raita", quantity: 1, price: 50 },
    ],
    subtotal: 490,
    totalAmount: 514,
    status: "PENDING",
    createdAt: "Just now",
  },
  {
    id: "ord-4",
    orderNumber: "ORD-1091",
    tableNumber: "4",
    items: [
      { name: "Crispy Corn & Salt Pepper", quantity: 1, price: 240 },
      { name: "Cold Coffee", quantity: 2, price: 60 },
    ],
    subtotal: 360,
    totalAmount: 378,
    status: "SERVED",
    createdAt: "25 mins ago",
  },
];

export default function LiveOrdersPage() {
  const [orders, setOrders] = useState<DashboardOrder[]>(INITIAL_ORDERS);
  const [filterTab, setFilterTab] = useState<"ACTIVE" | "PENDING" | "KITCHEN" | "READY" | "ALL">("ACTIVE");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [search, setSearch] = useState("");

  const playChime = useCallback(() => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {}
  }, [soundEnabled]);

  const updateStatus = (id: string, newStatus: DashboardOrder["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.tableNumber.includes(search);

    if (!matchesSearch) return false;

    if (filterTab === "PENDING") return o.status === "PENDING";
    if (filterTab === "KITCHEN") return o.status === "PREPARING" || o.status === "ACCEPTED";
    if (filterTab === "READY") return o.status === "READY";
    if (filterTab === "ACTIVE")
      return o.status === "PENDING" || o.status === "ACCEPTED" || o.status === "PREPARING" || o.status === "READY";
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/80">
        <div>
          <h2 className="text-xl font-bold text-[#0B192C]">Live Orders Monitor</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Realtime dining orders with instant status workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playChime();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-300 text-xs font-semibold text-zinc-700 bg-white hover:bg-zinc-50"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="h-4 w-4 text-emerald-600" /> Sound Alert ON
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4 text-zinc-400" /> Muted
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-zinc-200/60 p-1 rounded-xl overflow-x-auto no-scrollbar">
          {(["ACTIVE", "PENDING", "KITCHEN", "READY", "ALL"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterTab === tab
                  ? "bg-[#0B192C] text-white shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {tab} (
              {tab === "ACTIVE"
                ? orders.filter(
                    (o) =>
                      o.status === "PENDING" ||
                      o.status === "ACCEPTED" ||
                      o.status === "PREPARING" ||
                      o.status === "READY"
                  ).length
                : tab === "PENDING"
                ? orders.filter((o) => o.status === "PENDING").length
                : tab === "KITCHEN"
                ? orders.filter((o) => o.status === "PREPARING" || o.status === "ACCEPTED").length
                : tab === "READY"
                ? orders.filter((o) => o.status === "READY").length
                : orders.length}
              )
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64 relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search order # or table..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white pl-8 pr-3 py-1.5 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-hidden focus:border-[#0E8388]"
          />
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOrders.map((ord) => (
          <Card key={ord.id} className="flex flex-col justify-between overflow-hidden">
            <div>
              {/* Order Card Header */}
              <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/60">
                <div>
                  <span className="text-sm font-bold text-zinc-900">
                    Table {ord.tableNumber}
                  </span>
                  <span className="text-[11px] text-zinc-500 block font-mono">
                    #{ord.orderNumber}
                  </span>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      ord.status === "READY"
                        ? "success"
                        : ord.status === "PREPARING"
                        ? "warning"
                        : ord.status === "PENDING"
                        ? "teal"
                        : "neutral"
                    }
                  >
                    {ord.status}
                  </Badge>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">
                    {ord.createdAt}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="p-4 space-y-2">
                {ord.specialInstructions && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 italic">
                    Note: {ord.specialInstructions}
                  </p>
                )}

                <div className="divide-y divide-zinc-100 text-xs">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="py-1.5 flex items-center justify-between">
                      <span className="text-zinc-700">
                        {item.name}{" "}
                        <strong className="text-zinc-900">×{item.quantity}</strong>
                      </span>
                      <span className="text-zinc-500 font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-zinc-900">
                  <span>Total Amount:</span>
                  <span className="text-[#0E8388] text-sm">
                    {formatCurrency(ord.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-3 bg-zinc-50 border-t border-zinc-100 flex items-center gap-2">
              {ord.status === "PENDING" && (
                <Button
                  size="sm"
                  onClick={() => updateStatus(ord.id, "PREPARING")}
                  className="w-full bg-[#0E8388] hover:bg-teal-600 text-white text-xs font-semibold"
                >
                  <ChefHat className="h-3.5 w-3.5 mr-1" />
                  Accept & Send to Kitchen
                </Button>
              )}

              {ord.status === "PREPARING" && (
                <Button
                  size="sm"
                  onClick={() => updateStatus(ord.id, "READY")}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Mark as Ready
                </Button>
              )}

              {ord.status === "READY" && (
                <Button
                  size="sm"
                  onClick={() => updateStatus(ord.id, "SERVED")}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Delivered to Table
                </Button>
              )}

              {ord.status === "SERVED" && (
                <span className="w-full text-center text-xs text-zinc-400 py-1 font-medium">
                  Order Completed
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

