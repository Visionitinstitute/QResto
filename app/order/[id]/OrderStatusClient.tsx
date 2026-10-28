"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  ChefHat,
  BellRing,
  UtensilsCrossed,
  XCircle,
  Star,
  ArrowLeft,
  Send,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import { Order, OrderItem } from "@/types";

interface ExtendedOrder extends Order {
  hotels?: {
    name: string;
    slug: string;
    phone?: string | null;
    address?: string | null;
  } | null;
}

interface OrderStatusClientProps {
  initialOrder: ExtendedOrder;
  items: OrderItem[];
  hasReviewed: boolean;
}

const steps = [
  { key: "pending", label: "Placed", icon: Clock, desc: "Order hotel ko mil gaya hai" },
  { key: "accepted", label: "Accepted", icon: CheckCircle2, desc: "Kitchen ne order accept kar liya" },
  { key: "preparing", label: "Preparing", icon: ChefHat, desc: "Chef aapka khana bana rahe hain" },
  { key: "ready", label: "Ready", icon: BellRing, desc: "Order serve hone ke liye taiyaar hai" },
  { key: "served", label: "Served", icon: UtensilsCrossed, desc: "Aapke table par deliver ho gaya" },
];

export default function OrderStatusClient({
  initialOrder,
  items,
  hasReviewed: initialHasReviewed,
}: OrderStatusClientProps) {
  const [order, setOrder] = useState<ExtendedOrder>(initialOrder);
  const [hasReviewed, setHasReviewed] = useState(initialHasReviewed);

  // Review state
  const [rating, setRating] = useState(5);
  const [reviewName, setReviewName] = useState(initialOrder.customer_name || "");
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Supabase Realtime Listener (Prompt 6.4)
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`order-updates-${order.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${order.id}`,
        },
        (payload) => {
          if (payload.new) {
            setOrder((prev) => ({
              ...prev,
              ...(payload.new as Order),
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order.id]);

  // Determine current step index
  const getStepIndex = (status: string) => {
    switch (status) {
      case "pending":
        return 0;
      case "accepted":
        return 1;
      case "preparing":
        return 2;
      case "ready":
        return 3;
      case "served":
      case "completed":
        return 4;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex(order.status);
  const isRejected = order.status === "rejected";
  const isCompleted = order.status === "served" || order.status === "completed";

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError(null);
    setSubmittingReview(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("reviews").insert({
        hotel_id: order.hotel_id,
        order_id: order.id,
        customer_name: reviewName.trim() || "Guest Customer",
        rating,
        comment: reviewComment.trim() || null,
      });

      if (error) throw error;

      setReviewSuccess(true);
      setHasReviewed(true);
    } catch (err: unknown) {
      setReviewError(
        err instanceof Error ? err.message : "Review submit karne me error aayi."
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-zinc-200/80 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link
            href={`/menu/${order.hotels?.slug || ""}`}
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900"
          >
            <ArrowLeft className="w-4 h-4" /> Menu Par Jayein
          </Link>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Tracking
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        {/* Status Banner */}
        <div className="text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-extrabold mb-2">
            Table {order.table_number}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            {isRejected
              ? "Order Cancel / Reject Ho Gaya"
              : isCompleted
              ? "Aapka Order Serve Ho Gaya! 🎉"
              : "Khana Taiyaar Ho Raha Hai..."}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            {order.hotels?.name} • Order #{order.id.slice(0, 8)}
          </p>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PROGRESS STEPPER (Prompt 6.3 & 6.4)                           */}
        {/* ------------------------------------------------------------- */}
        <Card className="p-5 sm:p-6">
          {isRejected ? (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
              <XCircle className="w-6 h-6 text-red-600 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-red-900">
                  Order Reject Kar Diya Gaya
                </h3>
                <p className="text-xs text-red-700 mt-0.5">
                  Hotel staff dwara kisi kaaranवश order ko reject kar diya gaya hai. Kripya counter par sampark karein.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stepper Progress Bar */}
              <div className="relative flex items-center justify-between">
                <div className="absolute top-4 left-6 right-6 h-1 bg-zinc-200 -z-0">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                    style={{
                      width: `${(currentStep / (steps.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                {steps.map((st, idx) => {
                  const Icon = st.icon;
                  const isPassed = idx < currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div
                      key={st.key}
                      className="flex flex-col items-center z-10 text-center"
                    >
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all ${
                          isPassed || isCurrent
                            ? "bg-orange-600 text-white shadow-md shadow-orange-500/30 scale-105"
                            : "bg-zinc-100 text-zinc-400 border border-zinc-200"
                        }`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs font-bold mt-2 ${
                          isCurrent
                            ? "text-orange-600"
                            : isPassed
                            ? "text-zinc-800"
                            : "text-zinc-400"
                        }`}
                      >
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Current Active Step Banner */}
              <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/60 text-center">
                <p className="text-xs font-semibold text-orange-950">
                  {steps[currentStep]?.desc}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* ------------------------------------------------------------- */}
        {/* ORDER ITEMS & BILL SUMMARY                                    */}
        {/* ------------------------------------------------------------- */}
        <Card className="p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-2 flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-orange-600" />
            Order Items Details
          </h2>

          <div className="divide-y divide-zinc-100">
            {items.map((item) => (
              <div
                key={item.id}
                className="py-2.5 flex items-center justify-between text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-orange-600">
                    {item.quantity}x
                  </span>
                  <span className="font-medium text-zinc-900">
                    {item.item_name}
                  </span>
                </div>
                <span className="font-bold text-zinc-900">
                  ₹{Number(item.price) * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {order.note && (
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs">
              <span className="font-bold text-zinc-700">Special Instructions:</span>{" "}
              <span className="text-zinc-600">{order.note}</span>
            </div>
          )}

          <div className="pt-3 border-t border-zinc-200 flex items-center justify-between text-base font-black">
            <span>Total Bill Amount</span>
            <span className="text-orange-600 text-lg">₹{order.total_amount}</span>
          </div>
        </Card>

        {/* ------------------------------------------------------------- */}
        {/* CUSTOMER RATING & REVIEW FORM (Prompt 9.1)                    */}
        {/* ------------------------------------------------------------- */}
        {isCompleted && (
          <Card className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-black text-zinc-900">
                Aapka Khana Kaisa Raha?
              </h2>
            </div>
            <p className="text-xs text-zinc-500 mb-4">
              Apna anubhav share karein aur restaurant ko rating dein.
            </p>

            {hasReviewed || reviewSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-xs sm:text-sm text-emerald-800 font-bold">
                  Aapka review safaltapoorvak darj kar liya gaya hai. Dhanyavaad!
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {reviewError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {reviewError}
                  </div>
                )}

                {/* Star Selector */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    Rating (1 se 5 Stars)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-zinc-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-extrabold text-amber-700 ml-2">
                      {rating} Star{rating > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Aapka Naam
                  </label>
                  <input
                    type="text"
                    placeholder="Guest Customer"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Feedback / Comment
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Khana bahut swadisht tha, service fast thi..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={submittingReview}
                  className="w-full"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" /> Rating Submit Karein
                </Button>
              </form>
            )}
          </Card>
        )}
      </main>
    </div>
  );
}
