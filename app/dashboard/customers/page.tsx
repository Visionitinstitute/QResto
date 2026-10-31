"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Sparkles,
  Award,
  TrendingUp,
  Clock,
  Phone,
  Hash,
  ShoppingBag,
  Bell,
  Send,
  Eye,
  X,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Modal } from "@/components/ui/Modal";
import { Order } from "@/types";

interface DinerCustomer {
  username: string;
  displayName: string;
  phone?: string;
  visitCount: number;
  totalSpend: number;
  lastVisitDate: string;
  lastTable: number;
  tags: ("First-Timer" | "Regular Diner" | "VIP Diner")[];
  orders: Order[];
}

export default function CustomersPage() {
  const [loading, setLoading] = useState(true);
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [hotelName, setHotelName] = useState<string>("");
  const [customers, setCustomers] = useState<DinerCustomer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "vip" | "regular" | "first_time">("all");

  // Selected customer for modal
  const [selectedCustomer, setSelectedCustomer] = useState<DinerCustomer | null>(null);

  // Table announcement state
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastSent, setBroadcastSent] = useState(false);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        // Get manager's hotel
        const { data: hotel } = await supabase
          .from("hotels")
          .select("id, name")
          .eq("owner_id", user.id)
          .maybeSingle();

        if (!hotel) {
          setLoading(false);
          return;
        }

        setHotelId(hotel.id);
        setHotelName(hotel.name);

        // Fetch all orders for this hotel
        const { data: ordersData, error } = await supabase
          .from("orders")
          .select("id, table_number, customer_name, customer_phone, total_amount, status, created_at, note")
          .eq("hotel_id", hotel.id)
          .order("created_at", { ascending: false });

        if (error || !ordersData) {
          console.error("Error loading orders for customers:", error);
          setLoading(false);
          return;
        }

        // Aggregate orders into unique diner profiles
        const map = new Map<string, DinerCustomer>();

        ordersData.forEach((ord) => {
          const rawName = ord.customer_name || "Guest";
          const phone = ord.customer_phone || "";

          // Extract handle if formatted as "Name (@handle)" or "@handle"
          let username = "";
          let displayName = rawName;

          const handleMatch = rawName.match(/@([a-z0-9_]+)/i);
          if (handleMatch) {
            username = handleMatch[1].toLowerCase();
            displayName = rawName.replace(/\s*\(?@[a-z0-9_]+\)?/i, "").trim() || username;
          } else if (phone) {
            username = `guest_${phone.slice(-4)}`;
          } else {
            username = `guest_${ord.id.slice(0, 4)}`;
          }

          const key = username.toLowerCase();

          if (!map.has(key)) {
            map.set(key, {
              username,
              displayName: displayName || username,
              phone: phone || undefined,
              visitCount: 1,
              totalSpend: Number(ord.total_amount) || 0,
              lastVisitDate: ord.created_at,
              lastTable: ord.table_number,
              tags: [],
              orders: [ord as Order],
            });
          } else {
            const existing = map.get(key)!;
            existing.visitCount += 1;
            existing.totalSpend += Number(ord.total_amount) || 0;
            existing.orders.push(ord as Order);
            if (!existing.phone && phone) existing.phone = phone;
          }
        });

        // Compute tags for each customer
        const customerList = Array.from(map.values()).map((c) => {
          const tags: ("First-Timer" | "Regular Diner" | "VIP Diner")[] = [];
          if (c.totalSpend >= 2000) {
            tags.push("VIP Diner");
          }
          if (c.visitCount >= 3) {
            tags.push("Regular Diner");
          }
          if (c.visitCount === 1) {
            tags.push("First-Timer");
          }
          return { ...c, tags };
        });

        // Sort by visit count and spend descending
        customerList.sort((a, b) => b.totalSpend - a.totalSpend);
        setCustomers(customerList);
      } catch (err) {
        console.error("Customers CRM load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, []);

  // Filtered list
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.phone && c.phone.includes(searchQuery));

      if (!matchesSearch) return false;

      if (activeFilter === "vip") return c.tags.includes("VIP Diner");
      if (activeFilter === "regular") return c.tags.includes("Regular Diner");
      if (activeFilter === "first_time") return c.tags.includes("First-Timer");

      return true;
    });
  }, [customers, searchQuery, activeFilter]);

  // Summary Metrics
  const totalDiners = customers.length;
  const regularDiners = customers.filter((c) => c.tags.includes("Regular Diner")).length;
  const vipDiners = customers.filter((c) => c.tags.includes("VIP Diner")).length;
  const totalSpendAll = customers.reduce((sum, c) => sum + c.totalSpend, 0);

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastMessage("");
      setBroadcastSent(false);
    }, 3500);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-zinc-950 tracking-tight">
              Customer & Diner CRM
            </h1>
            <span className="text-[10px] font-bold bg-[#0B192C] text-[#39ff14] border border-[#39ff14]/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {hotelName || "Restaurant"}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Track repeat guests, lifetime dining spend, and unique @usernames without mandatory passwords.
          </p>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-5 border-zinc-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Total Diners
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-zinc-950 mt-2">
            {totalDiners}
          </p>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Unique guest handles recorded
          </span>
        </Card>

        <Card className="p-4 sm:p-5 border-zinc-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Regular Diners
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2">
            {regularDiners}
          </p>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Visited 3+ times at your venue
          </span>
        </Card>

        <Card className="p-4 sm:p-5 border-zinc-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              VIP Diners
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#0B192C] text-[#39ff14] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-zinc-950 mt-2">
            {vipDiners}
          </p>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Spent over ₹2,000+ in dining
          </span>
        </Card>

        <Card className="p-4 sm:p-5 border-zinc-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Total Diner Spend
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-zinc-950 mt-2">
            ₹{totalSpendAll.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Cumulative order volume
          </span>
        </Card>
      </div>

      {/* Live Table Web Announcement Box (Replacing WhatsApp with Web Push) */}
      <Card className="p-5 sm:p-6 bg-gradient-to-r from-zinc-900 via-[#0B192C] to-zinc-900 text-white border-zinc-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#39ff14]/15 border border-[#39ff14]/30 text-[#39ff14] text-[10px] font-bold uppercase tracking-wider">
              <Bell className="w-3 h-3 text-[#39ff14]" />
              In-Browser Web Broadcast
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Send Instant Table Announcement
            </h3>
            <p className="text-xs text-zinc-300 max-w-xl leading-relaxed">
              Broadcast a live web notification and audio chime directly to active diner screens at your tables (e.g., Happy Hour deals or chef recommendations).
            </p>
          </div>

          <form onSubmit={handleSendAnnouncement} className="flex-1 max-w-md flex gap-2">
            <Input
              type="text"
              placeholder="e.g. Free Dessert with all orders above ₹500!"
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400 text-xs"
              required
            />
            <Button
              type="submit"
              className="bg-[#39ff14] hover:bg-[#32e010] text-[#0B192C] font-black text-xs px-4 shrink-0 shadow-md shadow-[#39ff14]/20"
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              <span>Broadcast</span>
            </Button>
          </form>
        </div>

        {broadcastSent && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Web announcement successfully sent to active table sessions!</span>
          </div>
        )}
      </Card>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <div className="relative max-w-sm w-full">
          <Input
            type="text"
            placeholder="Search by @username, name, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeFilter === "all"
                ? "bg-[#0B192C] text-[#39ff14] shadow-xs"
                : "bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900"
            }`}
          >
            All ({customers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("regular")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeFilter === "regular"
                ? "bg-[#0B192C] text-[#39ff14] shadow-xs"
                : "bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Regulars ({regularDiners})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("vip")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeFilter === "vip"
                ? "bg-[#0B192C] text-[#39ff14] shadow-xs"
                : "bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900"
            }`}
          >
            VIPs ({vipDiners})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("first_time")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeFilter === "first_time"
                ? "bg-[#0B192C] text-[#39ff14] shadow-xs"
                : "bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900"
            }`}
          >
            First-Timers
          </button>
        </div>
      </div>

      {/* Customer Directory Table */}
      <Card className="overflow-hidden border-zinc-200 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50/80 border-b border-zinc-200/80 text-zinc-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Diner Identity</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Total Visits</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Last Visit</th>
                <th className="py-3 px-4">Status Tag</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    <Users className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                    <p className="font-semibold">No customers found</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      When guests scan and order from table QR codes, their profiles will appear here.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((diner) => (
                  <tr key={diner.username} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#0B192C] text-[#39ff14] border border-[#39ff14]/30 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          @
                        </div>
                        <div>
                          <span className="font-bold text-zinc-950 block">
                            @{diner.username}
                          </span>
                          <span className="text-[11px] text-zinc-500">
                            {diner.displayName}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-600">
                      {diner.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{diner.phone}</span>
                        </div>
                      ) : (
                        <span className="text-zinc-400 italic">Not provided</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-zinc-900">
                      <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 text-[11px]">
                        {diner.visitCount} {diner.visitCount === 1 ? "order" : "orders"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-black text-zinc-950">
                      ₹{diner.totalSpend.toLocaleString("en-IN")}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-600">
                      <div>
                        <span className="text-zinc-900 font-medium block">
                          Table #{diner.lastTable}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {new Date(diner.lastVisitDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {diner.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              tag === "VIP Diner"
                                ? "bg-[#0B192C] text-[#39ff14] border border-[#39ff14]/40"
                                : tag === "Regular Diner"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-zinc-100 text-zinc-700"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedCustomer(diner)}
                        className="text-xs font-bold py-1 px-2.5 h-auto text-zinc-700 hover:text-zinc-950"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        <span>History</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Customer Order History Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={Boolean(selectedCustomer)}
          onClose={() => setSelectedCustomer(null)}
          title={`Diner Profile: @${selectedCustomer.username}`}
          maxWidth="lg"
        >
          <div className="space-y-5">
            {/* Top Identity Card */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0B192C] text-[#39ff14] border border-[#39ff14]/30 font-black text-lg flex items-center justify-center shadow-xs">
                  @
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-950">
                    @{selectedCustomer.username}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {selectedCustomer.displayName}
                    {selectedCustomer.phone && ` • ${selectedCustomer.phone}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedCustomer.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#0B192C] text-[#39ff14] border border-[#39ff14]/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">
                  Total Visits
                </span>
                <p className="text-lg font-black text-zinc-900 mt-0.5">
                  {selectedCustomer.visitCount}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">
                  Total Spent
                </span>
                <p className="text-lg font-black text-emerald-700 mt-0.5">
                  ₹{selectedCustomer.totalSpend.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">
                  Avg. Ticket
                </span>
                <p className="text-lg font-black text-zinc-900 mt-0.5">
                  ₹{Math.round(selectedCustomer.totalSpend / selectedCustomer.visitCount).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Order History */}
            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-3">
                Order History ({selectedCustomer.orders.length})
              </h4>
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {selectedCustomer.orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3 rounded-xl border border-zinc-200/90 bg-white flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900">
                          Table #{ord.table_number}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-100 font-semibold uppercase text-zinc-600">
                          {ord.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">
                        {new Date(ord.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-zinc-950 block">
                        ₹{ord.total_amount}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        #{ord.id.slice(0, 6)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

