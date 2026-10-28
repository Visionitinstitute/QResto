import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CustomerMenuView from "@/components/menu/CustomerMenuView";
import { Hotel, Category, MenuItem } from "@/types";

export const dynamic = "force-dynamic";

interface MenuPageProps {
  params: Promise<{ slug: string }>;
}

export default async function MenuPage({ params }: MenuPageProps) {
  const { slug } = await params;

  let hotel: Hotel | null = null;
  let categories: Category[] = [];
  let items: MenuItem[] = [];
  let avgRating = 4.8;
  let reviewCount = 12;

  try {
    const supabase = await createClient();

    // 1. Fetch hotel by slug
    const { data: hotelData } = await supabase
      .from("hotels")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (!hotelData) {
      notFound();
    }

    const currentHotel: Hotel = hotelData;
    hotel = currentHotel;

    // 2. Fetch categories and menu items in parallel
    const [catRes, itemRes, reviewRes] = await Promise.all([
      supabase
        .from("categories")
        .select("*")
        .eq("hotel_id", currentHotel.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("menu_items")
        .select("*")
        .eq("hotel_id", currentHotel.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("reviews")
        .select("rating")
        .eq("hotel_id", currentHotel.id),
    ]);

    categories = catRes.data || [];
    items = itemRes.data || [];

    const reviews = reviewRes.data || [];
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0);
      avgRating = sum / reviews.length;
      reviewCount = reviews.length;
    }
  } catch (err) {
    console.error("Error fetching menu page data:", err);
    notFound();
  }

  if (!hotel) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <CustomerMenuView
        hotel={hotel}
        categories={categories}
        items={items}
        avgRating={avgRating}
        reviewCount={reviewCount}
      />
    </Suspense>
  );
}
