"use client";

import React from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  UtensilsCrossed,
  CheckCircle2,
  Clock,
  ChefHat,
  BellRing,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, Badge, Button } from "@meraresto/ui";

export default function OrderTrackingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = (params?.id as string) || "ORD-1092";
  const table = searchParams?.get("table") || "1";
  const slug = searchParams?.get("slug") || "balkumari";

  const steps = [
    { title: "Order Received", desc: "Sent to kitchen display", done: true, current: false },
    { title: "In Kitchen", desc: "Chef is preparing your meal", done: true, current: true },
    { title: "Ready for Serving", desc: "Plated and garnished", done: false, current: false },
    { title: "Delivered to Table", desc: "Enjoy your dining experience", done: false, current: false },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] p-4 text-[#0B192C]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
        <button
          onClick={() => router.push(`/${slug}?table=${table}`)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Menu
        </button>
        <Badge variant="teal" className="text-xs">
          Table {table}
        </Badge>
      </div>

      <div className="mt-6 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 mb-3 animate-pulse">
          <ChefHat className="h-7 w-7" />
        </div>
        <h1 className="text-lg font-bold text-zinc-900">Your Meal is Being Prepared</h1>
        <p className="text-xs text-zinc-500 mt-1 font-mono">Order #{orderId}</p>
        <p className="mt-2 text-xs font-semibold text-[#0E8388]">
          Estimated time: ~12-15 mins
        </p>
      </div>

      {/* Progress Timeline */}
      <Card className="mt-6">
        <CardContent className="p-5">
          <div className="space-y-6 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-zinc-200">
            {steps.map((s, idx) => (
              <div key={idx} className="relative flex items-start gap-4">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-white shrink-0 z-10 ${
                    s.done
                      ? "bg-[#0E8388]"
                      : s.current
                      ? "bg-amber-500 ring-4 ring-amber-100"
                      : "bg-zinc-300"
                  }`}
                >
                  {s.done ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Clock className="h-3.5 w-3.5" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">{s.title}</h4>
                  <p className="text-[11px] text-zinc-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="mt-6 space-y-3">
        <Button
          onClick={() => router.push(`/${slug}?table=${table}`)}
          className="w-full bg-[#0B192C] hover:bg-zinc-800 text-white text-xs"
        >
          Order Additional Items
        </Button>
        <p className="text-center text-[11px] text-zinc-400">
          Need assistance? Please inform your table attendant.
        </p>
      </div>
    </div>
  );
}

