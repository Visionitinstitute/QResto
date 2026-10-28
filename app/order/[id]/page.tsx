import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OrderStatusClient from "./OrderStatusClient";
import { OrderItem } from "@/types";

export const dynamic = "force-dynamic";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;

  let order = null;
  let items: OrderItem[] = [];
  let existingReview = null;

  try {
    const supabase = await createClient();

    // 1. Fetch order details
    const { data: orderData } = await supabase
      .from("orders")
      .select("*, hotels (name, slug, phone, address)")
      .eq("id", id)
      .maybeSingle();

    order = orderData;

    if (order) {
      // 2. Fetch order items
      const { data: itemsData } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", id);

      items = itemsData || [];

      // 3. Check if review already exists
      const { data: reviewData } = await supabase
        .from("reviews")
        .select("*")
        .eq("order_id", id)
        .maybeSingle();

      existingReview = reviewData;
    }
  } catch (err) {
    console.error("Error fetching order page:", err);
  }

  if (!order) {
    notFound();
  }

  return (
    <OrderStatusClient
      initialOrder={order}
      items={items}
      hasReviewed={Boolean(existingReview)}
    />
  );
}
