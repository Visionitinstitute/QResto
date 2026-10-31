"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Store,
  User,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { createClient } from "@/lib/supabase/client";
import { Hotel, Review } from "@/types";

export default function DashboardReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function loadReviews() {
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

            const { data: reviewsData } = await supabase
              .from("reviews")
              .select("*")
              .eq("hotel_id", hotelData.id)
              .order("created_at", { ascending: false });

            setReviews(reviewsData || []);
          }
        }
      } catch (err) {
        console.error("Error loading reviews:", err);
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);

  // Compute stats
  const stats = useMemo(() => {
    if (reviews.length === 0) {
      return {
        avg: 5.0,
        total: 0,
        breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const total = reviews.length;
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = sum / total;

    const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (breakdown[r.rating] !== undefined) {
        breakdown[r.rating]++;
      }
    });

    return { avg, total, breakdown };
  }, [reviews]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-zinc-500">Reviews load ho rahe hain...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-zinc-200">
        <Store className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-zinc-900">Please set up your restaurant first</h2>
        <Link href="/dashboard" className="mt-4 inline-block">
          <Button>Go to Dashboard Overview</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2.5">
          <Star className="w-6 h-6 text-amber-500 fill-amber-500" /> Customer Reviews & Ratings
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
          Monitor your customer feedback, star ratings, and dining experience reviews here.
        </p>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. OVERALL RATING & BREAKDOWN (Prompt 9.2)                    */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average Score Card */}
        <Card className="p-6 flex flex-col items-center justify-center text-center bg-gradient-to-tr from-orange-50/60 to-white">
          <span className="text-4xl sm:text-5xl font-black text-zinc-900">
            {stats.avg.toFixed(1)}
          </span>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(stats.avg)
                    ? "fill-amber-400 text-amber-400"
                    : "text-zinc-200"
                }`}
              />
            ))}
          </div>
          <p className="text-xs font-semibold text-zinc-500">
            Based on {stats.total} {stats.total === 1 ? "review" : "reviews"}
          </p>
        </Card>

        {/* Star Breakdown Bars */}
        <Card className="p-6 md:col-span-2 space-y-2.5 justify-center flex flex-col">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.breakdown[star as keyof typeof stats.breakdown] || 0;
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-bold text-zinc-700 flex items-center gap-1">
                  {star} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right font-medium text-zinc-400">
                  {count}
                </span>
              </div>
            );
          })}
        </Card>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. REVIEWS LIST                                               */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-orange-600" /> All Customer Feedback ({reviews.length})
        </h2>

        {reviews.length === 0 ? (
          <Card className="text-center py-16 px-4">
            <ThumbsUp className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-800">
              Abhi tak koi review nahi aaya
            </h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              Jab customer table par order complete hone ke baad review submit karenge, toh yahan dikhenge.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <Card key={rev.id} className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-zinc-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">
                        {rev.customer_name || "Guest Customer"}
                      </p>
                      <p className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(rev.created_at).toLocaleDateString([], {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/60">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span className="text-xs font-black text-amber-800">
                      {rev.rating}.0
                    </span>
                  </div>
                </div>

                {rev.comment ? (
                  <p className="text-xs text-zinc-600 leading-relaxed italic bg-zinc-50/50 p-2.5 rounded-xl border border-zinc-100">
                    &quot;{rev.comment}&quot;
                  </p>
                ) : (
                  <p className="text-xs text-zinc-400 italic">
                    (No written comment provided)
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
