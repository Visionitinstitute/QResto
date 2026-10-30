"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  XCircle,
  ChefHat,
  BellRing,
  Store,
  Phone,
  FileText,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { createClient } from "@/lib/supabase/client";
import { Order, OrderItem, Hotel, OrderStatus } from "@/types";

interface OrderWithItems extends Order {
  order_items?: OrderItem[];
}

export default function ManagerOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "active" | "completed" | "all">("pending");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Play synthetic web audio bell chime on new order
  const playNewOrderBeep = useCallback(() => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch {
      // Audio context might be restricted before user interaction
    }
  }, [soundEnabled]);

  // Load initial orders
  useEffect(() => {
    async function loadHotelAndOrders() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: hotelData } = await supabase
            .from("hotels")
            .select("*")
            .eq("owner_id", user.id)
            .maybeSingle();

          if (hotelData) {
            setHotel(hotelData);

            const { data: ordersData } = await supabase
              .from("orders")
              .select("*, order_items (*)")
              .eq("hotel_id", hotelData.id)
              .order("created_at", { ascending: false });

            setOrders(ordersData || []);
          }
        }
      } catch (err) {
        console.error("Error loading manager orders:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHotelAndOrders();
  }, []);

  // Supabase Realtime Subscription (Prompt 7.4)
  useEffect(() => {
    if (!hotel) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`hotel-orders-${hotel.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `hotel_id=eq.${hotel.id}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const newOrder = payload.new as Order;
            // Fetch items for this new order
            const { data: items } = await supabase
              .from("order_items")
              .select("*")
              .eq("order_id", newOrder.id);

            setOrders((prev) => [{ ...newOrder, order_items: items || [] }, ...prev]);
            playNewOrderBeep();
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as Order;
            setOrders((prev) =>
              prev.map((o) =>
                o.id === updated.id
                  ? { ...o, ...updated, order_items: o.order_items }
                  : o
              )
            );
          } else if (payload.eventType === "DELETE") {
            const oldId = (payload.old as { id: string }).id;
            setOrders((prev) => prev.filter((o) => o.id !== oldId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [hotel, playNewOrderBeep]);

  // Tab Filtering
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (activeTab === "pending") return order.status === "pending";
      if (activeTab === "active")
        return ["accepted", "preparing", "ready"].includes(order.status);
      if (activeTab === "completed")
        return ["served", "completed", "rejected"].includes(order.status);
      return true;
    });
  }, [orders, activeTab]);

  const counts = useMemo(() => {
    return {
      pending: orders.filter((o) => o.status === "pending").length,
      active: orders.filter((o) => ["accepted", "preparing", "ready"].includes(o.status)).length,
      completed: orders.filter((o) => ["served", "completed", "rejected"].includes(o.status)).length,
    };
  }, [orders]);

  // Status Update Handler (Prompt 7.2 & 7.3)
  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    setActionLoadingId(orderId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("orders")
        .update({ status: nextStatus })
        .eq("id", orderId);

      if (error) throw error;

      // Optimistic update
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
      );
    } catch (err) {
      console.error("Error updating order status:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">⏳ Pending</Badge>;
      case "accepted":
        return <Badge variant="info">✓ Accepted</Badge>;
      case "preparing":
        return <Badge variant="warning">🍳 Cooking</Badge>;
      case "ready":
        return <Badge variant="success">🔔 Ready</Badge>;
      case "served":
      case "completed":
        return <Badge variant="success">🎉 Served</Badge>;
      case "rejected":
        return <Badge variant="danger">✕ Rejected</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-zinc-500">Live Orders load ho rahe hain...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-zinc-200">
        <Store className="w-10 h-10 text-orange-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-zinc-900">Pehle apna hotel set up karein</h2>
        <Link href="/dashboard" className="mt-4 inline-block">
          <Button>Dashboard Overview par jayein</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2.5">
            <UtensilsCrossed className="w-6 h-6 text-orange-600" /> Live Kitchen Orders
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Realtime orders monitor karein aur status turant update karein.
          </p>
        </div>

        {/* Sound toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition ${
            soundEnabled
              ? "bg-orange-50 text-orange-800 border-orange-200"
              : "bg-zinc-100 text-zinc-500 border-zinc-200"
          }`}
          title="Toggle notification sound"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-orange-600" /> Sound Alert ON
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-zinc-400" /> Sound OFF
            </>
          )}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-zinc-200/80 shadow-xs select-none overflow-x-auto">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === "pending"
              ? "bg-orange-600 text-white shadow-xs"
              : "text-zinc-600 hover:bg-zinc-100"
          }`}
        >
          Pending
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === "pending"
                ? "bg-white/30 text-white"
                : "bg-orange-100 text-orange-700 font-extrabold"
            }`}
          >
            {counts.pending}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("active")}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === "active"
              ? "bg-orange-600 text-white shadow-xs"
              : "text-zinc-600 hover:bg-zinc-100"
          }`}
        >
          In Progress
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === "active"
                ? "bg-white/30 text-white"
                : "bg-blue-100 text-blue-700 font-extrabold"
            }`}
          >
            {counts.active}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === "completed"
              ? "bg-orange-600 text-white shadow-xs"
              : "text-zinc-600 hover:bg-zinc-100"
          }`}
        >
          Completed
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === "completed"
                ? "bg-white/30 text-white"
                : "bg-zinc-100 text-zinc-600 font-extrabold"
            }`}
          >
            {counts.completed}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("all")}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition ${
            activeTab === "all"
              ? "bg-orange-600 text-white shadow-xs"
              : "text-zinc-600 hover:bg-zinc-100"
          }`}
        >
          All ({orders.length})
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card className="text-center py-16 px-4">
          <Clock className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-800">
            Abhi koi order nahi hai
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Jaise hi table se naya order aayega, yahan realtime me update dikhega.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrders.map((order) => {
            const isPending = order.status === "pending";
            const isAccepted = order.status === "accepted";
            const isPreparing = order.status === "preparing";
            const isReady = order.status === "ready";
            const isActionLoading = actionLoadingId === order.id;

            return (
              <Card
                key={order.id}
                className={`p-5 space-y-4 transition border ${
                  isPending
                    ? "border-amber-300 ring-2 ring-amber-200/50 bg-amber-50/20"
                    : "border-zinc-200/80"
                }`}
              >
                {/* Header: Table, Status & Time */}
                <div className="flex items-start justify-between gap-3 border-b border-zinc-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-zinc-900 bg-orange-100 text-orange-900 px-2.5 py-0.5 rounded-lg">
                        Table {order.table_number}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 font-mono">
                      #{order.id.slice(0, 8)} •{" "}
                      {new Date(order.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-orange-600">
                      ₹{order.total_amount}
                    </span>
                  </div>
                </div>

                {/* Customer Details */}
                {(order.customer_name || order.customer_phone) && (
                  <div className="text-xs text-zinc-600 flex items-center gap-3">
                    {order.customer_name && (
                      <span className="font-semibold text-zinc-800">
                        {order.customer_name}
                      </span>
                    )}
                    {order.customer_phone && (
                      <span className="flex items-center gap-1 text-zinc-500">
                        <Phone className="w-3 h-3" /> {order.customer_phone}
                      </span>
                    )}
                  </div>
                )}

                {/* Note */}
                {order.note && (
                  <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-200/70 text-xs text-orange-950 flex items-start gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-bold">Note:</strong> {order.note}
                    </span>
                  </div>
                )}

                {/* Order Items */}
                <div className="divide-y divide-zinc-100 text-xs">
                  {order.order_items?.map((it) => (
                    <div
                      key={it.id}
                      className="py-1.5 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-black text-orange-600">
                          {it.quantity}x
                        </span>
                        <span className="font-medium text-zinc-800">
                          {it.item_name}
                        </span>
                      </div>
                      <span className="font-semibold text-zinc-600">
                        ₹{Number(it.price) * it.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons (Prompt 7.2 & 7.3) */}
                <div className="pt-2 border-t border-zinc-100 flex flex-wrap items-center justify-end gap-2">
                  {isPending && (
                    <>
                      <Button
                        variant="danger"
                        size="sm"
                        isLoading={isActionLoading}
                        onClick={() => handleUpdateStatus(order.id, "rejected")}
                        className="flex-1 sm:flex-initial"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        isLoading={isActionLoading}
                        onClick={() => handleUpdateStatus(order.id, "accepted")}
                        className="flex-1 sm:flex-initial"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Accept Order
                      </Button>
                    </>
                  )}

                  {isAccepted && (
                    <Button
                      variant="primary"
                      size="sm"
                      isLoading={isActionLoading}
                      onClick={() => handleUpdateStatus(order.id, "preparing")}
                      className="w-full sm:w-auto"
                    >
                      <ChefHat className="w-3.5 h-3.5 mr-1" /> Start Cooking
                    </Button>
                  )}

                  {isPreparing && (
                    <Button
                      variant="primary"
                      size="sm"
                      isLoading={isActionLoading}
                      onClick={() => handleUpdateStatus(order.id, "ready")}
                      className="w-full sm:w-auto"
                    >
                      <BellRing className="w-3.5 h-3.5 mr-1" /> Mark Ready
                    </Button>
                  )}

                  {isReady && (
                    <Button
                      variant="primary"
                      size="sm"
                      isLoading={isActionLoading}
                      onClick={() => handleUpdateStatus(order.id, "served")}
                      className="w-full sm:w-auto"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Served
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
