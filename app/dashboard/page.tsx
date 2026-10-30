"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Store,
  QrCode,
  UtensilsCrossed,
  ChefHat,
  Star,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Building2,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { createClient } from "@/lib/supabase/client";
import { Hotel } from "@/types";

export default function DashboardOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [hotel, setHotel] = useState<Hotel | null>(null);

  // Onboarding form state
  const [hotelName, setHotelName] = useState("");
  const [slug, setSlug] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submittingOnboarding, setSubmittingOnboarding] = useState(false);
  const [onboardingError, setOnboardingError] = useState<string | null>(null);

  // Stats state
  const [stats, setStats] = useState({
    pendingOrders: 0,
    todayOrders: 0,
    todaySales: 0,
    avgRating: 4.8,
  });

  useEffect(() => {
    async function loadDashboard() {
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

            const { count: pendingCount } = await supabase
              .from("orders")
              .select("*", { count: "exact", head: true })
              .eq("hotel_id", hotelData.id)
              .eq("status", "pending");

            const { data: allOrders } = await supabase
              .from("orders")
              .select("total_amount, created_at, status")
              .eq("hotel_id", hotelData.id);

            const totalOrders = allOrders?.length || 0;
            const totalSales =
              allOrders?.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0) || 0;

            setStats({
              pendingOrders: pendingCount || 0,
              todayOrders: totalOrders,
              todaySales: totalSales,
              avgRating: 4.9,
            });
          }
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  // Handle auto-generating slug from name
  const handleNameChange = (name: string) => {
    setHotelName(name);
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generatedSlug);
  };

  const handleCreateHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardingError(null);

    if (!hotelName.trim() || !slug.trim()) {
      setOnboardingError("Hotel ka naam aur URL slug zaroori hain.");
      return;
    }

    setSubmittingOnboarding(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setOnboardingError("Aap login nahi hain. Kripya punah login karein.");
        setSubmittingOnboarding(false);
        return;
      }

      const { data: newHotel, error } = await supabase
        .from("hotels")
        .insert({
          owner_id: user.id,
          name: hotelName.trim(),
          slug: slug.trim(),
          phone: phone.trim() || null,
          address: address.trim() || null,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          setOnboardingError(
            `URL slug "${slug}" pehle se kisi aur hotel dwara liya ja chuka hai. Kripya alag slug chunein.`
          );
        } else {
          setOnboardingError(error.message);
        }
        setSubmittingOnboarding(false);
        return;
      }

      setHotel(newHotel);
    } catch (err: unknown) {
      setOnboardingError(
        err instanceof Error ? err.message : "Hotel save karne me samasya aayi."
      );
      setSubmittingOnboarding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-zinc-500">
          Dashboard load ho raha hai...
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 1. HOTEL ONBOARDING FORM (Prompt 3.3)
  // -------------------------------------------------------------
  if (!hotel) {
    return (
      <div className="max-w-2xl mx-auto py-6 sm:py-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Store className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Apne Hotel Ki Jankari Bharein
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Aapka account ban chuka hai! Ab apne hotel ya cafe ko set up karein.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-10 shadow-sm">
          {onboardingError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium leading-relaxed">
                {onboardingError}
              </p>
            </div>
          )}

          <form onSubmit={handleCreateHotel} className="space-y-5">
            <div>
              <label
                htmlFor="hotelName"
                className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5"
              >
                Hotel / Restaurant Ka Naam *
              </label>
              <div className="relative">
                <Input
                  id="hotelName"
                  type="text"
                  placeholder="Royal Spice Restaurant"
                  value={hotelName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="pl-10"
                  required
                />
                <Building2 className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label
                htmlFor="slug"
                className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5"
              >
                Public Menu Link (Slug) *
              </label>
              <div className="relative">
                <Input
                  id="slug"
                  type="text"
                  placeholder="royal-spice"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase())}
                  className="pl-10"
                  required
                />
                <Globe className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                Aapka menu URL: <span className="font-mono text-orange-600">/menu/{slug || "hotel-slug"}</span>
              </p>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5"
              >
                Sampark Phone Number
              </label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10"
                />
                <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5"
              >
                Hotel Ka Pura Pata (Address)
              </label>
              <div className="relative">
                <Input
                  id="address"
                  type="text"
                  placeholder="Shop 12, Main Market, Civil Lines"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-10"
                />
                <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4"
              isLoading={submittingOnboarding}
            >
              Hotel Create Karein & Shuru Karein <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. DASHBOARD OVERVIEW (Prompt 3.4 & 10.3)
  // -------------------------------------------------------------
  return (
    <div className="space-y-8">
      {/* Clean Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/80">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
              {hotel.name}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Live & Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Dashboard Overview • Live orders, menu & table QR codes
          </p>
        </div>

        <Link
          href={`/menu/${hotel.slug}`}
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-orange-50 text-orange-600 border border-orange-200 font-bold text-xs sm:text-sm shadow-xs transition self-start sm:self-auto"
        >
          <span>Open Live Menu</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Key Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Pending Orders
            </p>
            <p className="text-2xl sm:text-3xl font-black text-orange-600 mt-1">
              {stats.pendingOrders}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Total Orders
            </p>
            <p className="text-2xl sm:text-3xl font-black text-zinc-900 mt-1">
              {stats.todayOrders}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Total Sales
            </p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
              ₹{stats.todaySales}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Avg Rating
            </p>
            <p className="text-2xl sm:text-3xl font-black text-amber-500 mt-1">
              {stats.avgRating} <span className="text-sm font-normal text-zinc-400">/ 5</span>
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Star className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Quick Action Navigation Grid */}
      <div>
        <h2 className="text-base font-bold text-zinc-900 mb-4">
          Quick Actions (Turant Kaam)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/dashboard/orders"
            className="p-5 rounded-2xl bg-white border border-zinc-200/80 hover:border-orange-300 hover:shadow-md transition flex items-start gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:text-white transition">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-sm group-hover:text-orange-600 transition">
                Live Orders Dashboard
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Kichen me aane wale naye orders dekhein aur status update karein.
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/menu"
            className="p-5 rounded-2xl bg-white border border-zinc-200/80 hover:border-orange-300 hover:shadow-md transition flex items-start gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-sm group-hover:text-orange-600 transition">
                Menu & Categories
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Nayi dish jodein, daam badlein aur availability on/off karein.
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/qr"
            className="p-5 rounded-2xl bg-white border border-zinc-200/80 hover:border-orange-300 hover:shadow-md transition flex items-start gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-sm group-hover:text-orange-600 transition">
                Table QR Codes
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Har table ke liye unique QR code print karein aur download karein.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
