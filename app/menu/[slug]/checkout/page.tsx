import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CheckoutClient from "./CheckoutClient";

export const dynamic = "force-dynamic";

interface CheckoutPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { slug } = await params;
  let hotel = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("hotels")
      .select("id, name, slug, phone, address")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    hotel = data;
  } catch (err) {
    console.error("Error in checkout page:", err);
  }

  if (!hotel) {
    notFound();
  }

  return <CheckoutClient hotel={hotel} />;
}
