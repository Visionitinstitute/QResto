import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { PLAN_QUOTAS, PlanTier } from "@meraresto/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, restaurantId } = body;

    if (!planId || !restaurantId) {
      return NextResponse.json(
        { error: "planId and restaurantId are required." },
        { status: 400 }
      );
    }

    const plan = PLAN_QUOTAS[planId as PlanTier];
    if (!plan) {
      return NextResponse.json({ error: "Invalid subscription plan." }, { status: 400 });
    }

    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock_key";
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

    // If Razorpay live keys are present, create actual order
    let razorpayOrderId = `sub_order_${Date.now()}`;

    if (razorpaySecret && razorpayKey !== "rzp_test_mock_key") {
      const authHeader = Buffer.from(`${razorpayKey}:${razorpaySecret}`).toString("base64");
      const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: plan.monthlyPrice * 100, // in paise
          currency: "INR",
          receipt: `rcpt_${restaurantId.slice(0, 8)}_${Date.now()}`,
          notes: {
            restaurantId,
            planId,
          },
        }),
      });

      const orderData = await orderRes.json();
      if (orderData.id) {
        razorpayOrderId = orderData.id;
      }
    }

    return NextResponse.json({
      success: true,
      orderId: razorpayOrderId,
      amount: plan.monthlyPrice * 100,
      currency: "INR",
      planName: plan.name,
      razorpayKey,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { error: error?.message || "Failed to initiate subscription." },
      { status: 500 }
    );
  }
}
