import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@meraresto/database";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature if secret configured
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature) {
        return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const payment = payload.payload?.payment?.entity;
    const notes = payment?.notes || {};
    const restaurantId = notes.restaurantId;
    const planId = notes.planId;

    if (restaurantId && (event === "payment.captured" || event === "subscription.charged")) {
      const adminClient = createAdminClient();

      const periodEnd = new Date();
      periodEnd.setDate(periodEnd.getDate() + 30);

      await adminClient
        .from("subscriptions")
        .upsert({
          restaurant_id: restaurantId,
          plan_id: planId || "pro",
          status: "ACTIVE",
          current_period_start: new Date().toISOString(),
          current_period_end: periodEnd.toISOString(),
          razorpay_customer_id: payment.customer_id || null,
          updated_at: new Date().toISOString(),
        });
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { error: error?.message || "Webhook processing error." },
      { status: 500 }
    );
  }
}

