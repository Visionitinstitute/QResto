"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Phone,
  MapPin,
  Globe,
  Save,
  CheckCircle2,
  AlertCircle,
  Store,
  Upload,
  Sparkles,
  CreditCard,
  QrCode,
  ChefHat,
  UtensilsCrossed,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { createClient } from "@/lib/supabase/client";
import { Hotel } from "@/types";
import {
  getStoredSubscription,
  UserSubscription,
  SUBSCRIPTION_PLANS,
} from "@/lib/subscription";
import { PlanUpgradeModal } from "@/components/dashboard/PlanUpgradeModal";

export default function DashboardSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    async function loadHotelDetails() {
      try {
        setLoading(true);
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data } = await supabase
            .from("hotels")
            .select("*")
            .eq("owner_id", user.id)
            .maybeSingle();

          const sub = getStoredSubscription(user, data?.id);
          setSubscription(sub);

          if (data) {
            setHotel(data);
            setName(data.name || "");
            setSlug(data.slug || "");
            setPhone(data.phone || "");
            setAddress(data.address || "");
            setLogoUrl(data.logo_url || "");
            setIsActive(data.is_active ?? true);
          }
        }
      } catch (err) {
        console.error("Error loading hotel settings:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHotelDetails();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotel) return;

    setStatusMessage(null);
    setSaving(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("hotels")
        .update({
          name: name.trim(),
          phone: phone.trim() || null,
          address: address.trim() || null,
          logo_url: logoUrl.trim() || null,
          is_active: isActive,
        })
        .eq("id", hotel.id);

      if (error) {
        setStatusMessage({ type: "error", text: error.message });
      } else {
        setStatusMessage({
          type: "success",
          text: "Restaurant settings saved successfully!",
        });
      }
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-zinc-500">Loading settings...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-zinc-200">
        <Store className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-zinc-900">Please set up your restaurant first</h2>
        <p className="text-sm text-zinc-500 mt-1 mb-4">
          You haven&apos;t added a restaurant profile yet.
        </p>
        <Link href="/dashboard">
          <Button>Go to Overview</Button>
        </Link>
      </div>
    );
  }

  const activePlan = subscription?.plan || SUBSCRIPTION_PLANS.starter;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Plan Upgrade Modal */}
      <PlanUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        currentPlanId={subscription?.planId}
        onPlanUpdated={(newSub) => setSubscription(newSub)}
      />

      <div>
        <h1 className="text-2xl font-black text-zinc-950 tracking-tight">
          Restaurant Settings & Subscription
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage your restaurant profile, subscription plan tier, and operational quotas.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 animate-in fade-in ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <p className="text-sm font-medium">{statusMessage.text}</p>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. SUBSCRIPTION & BILLING PLAN SECTION                        */}
      {/* ------------------------------------------------------------- */}
      <Card className="p-6 sm:p-7 border-zinc-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#39ff14] bg-[#0B192C] px-3 py-1 rounded-full border border-[#39ff14]/40">
                Active Subscription
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Paid & Active
              </span>
            </div>
            <h2 className="text-xl font-black text-zinc-950 mt-2">
              {activePlan.name} Plan
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">{activePlan.tagline}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="bg-[#0B192C] hover:bg-black text-[#39ff14] border border-[#39ff14]/40 font-bold text-xs cursor-pointer"
            >
              Change / Upgrade Plan <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>

        {/* Quota & Feature Entitlement Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/70">
            <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-semibold">
              <QrCode className="w-3.5 h-3.5 text-emerald-600" /> Max Tables
            </div>
            <p className="text-lg font-black text-zinc-900 mt-1">
              {activePlan.maxTables} Tables
            </p>
            <p className="text-[10px] text-zinc-400">High-res printable QR</p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/70">
            <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-semibold">
              <ChefHat className="w-3.5 h-3.5 text-amber-600" /> Menu Dishes
            </div>
            <p className="text-lg font-black text-zinc-900 mt-1">
              {activePlan.maxMenuItems} Items
            </p>
            <p className="text-[10px] text-zinc-400">With photos & tags</p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/70">
            <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-semibold">
              <UtensilsCrossed className="w-3.5 h-3.5 text-blue-600" /> Kitchen KDS
            </div>
            <p className="text-lg font-black text-zinc-900 mt-1">
              {activePlan.kdsEnabled ? "Unlocked" : "Locked"}
            </p>
            <p className="text-[10px] text-zinc-400">
              {activePlan.kdsEnabled ? "Live audio chimes" : "Pro plan required"}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/70">
            <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> Support
            </div>
            <p className="text-sm font-black text-zinc-900 mt-1 truncate">
              {activePlan.support.split(" ")[0]} Support
            </p>
            <p className="text-[10px] text-zinc-400 truncate">
              {activePlan.support}
            </p>
          </div>
        </div>

        {subscription?.transactionId && (
          <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between text-[11px] text-zinc-500">
            <span>
              Transaction ID:{" "}
              <strong className="font-mono text-zinc-800">
                {subscription.transactionId}
              </strong>
            </span>
            <span>
              Billing Interval:{" "}
              <strong className="capitalize text-zinc-800">
                {subscription.billing}
              </strong>
            </span>
            <span>
              Expires:{" "}
              <strong className="text-zinc-800">
                {new Date(subscription.expiresAt).toLocaleDateString()}
              </strong>
            </span>
          </div>
        )}
      </Card>

      {/* ------------------------------------------------------------- */}
      {/* 2. RESTAURANT PROFILE SETTINGS FORM                           */}
      {/* ------------------------------------------------------------- */}
      <Card className="p-6 sm:p-8">
        <h2 className="text-lg font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100">
          Restaurant Profile & Branding
        </h2>

        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="hotelName"
                className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5"
              >
                Hotel / Restaurant Name *
              </label>
              <div className="relative">
                <Input
                  id="hotelName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                Public Menu Slug (Permanent URL)
              </label>
              <div className="relative">
                <Input
                  id="slug"
                  type="text"
                  value={slug}
                  disabled
                  className="pl-10 bg-zinc-100 text-zinc-500 cursor-not-allowed"
                />
                <Globe className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Slug cannot be changed because your printed table QR codes are permanently linked to it.
              </p>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5"
              >
                Contact Phone Number
              </label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10"
                  placeholder="+91 98765 43210"
                />
                <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5"
              >
                Restaurant Address
              </label>
              <div className="relative">
                <Input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-10"
                  placeholder="Complete Address"
                />
                <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label
                htmlFor="logoUrl"
                className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5"
              >
                Logo Image URL (Optional)
              </label>
              <div className="relative">
                <Input
                  id="logoUrl"
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="pl-10"
                  placeholder="https://example.com/logo.png"
                />
                <Upload className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-zinc-300 focus:ring-emerald-500 cursor-pointer"
                />
                <div>
                  <span className="text-sm font-semibold text-zinc-900">
                    Keep Restaurant & Digital Menu Live
                  </span>
                  <p className="text-xs text-zinc-500">
                    If disabled, guests will not be able to view the menu when scanning table QR codes.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={saving}
              className="bg-[#0B192C] text-[#39ff14] border border-[#39ff14]/40 font-bold hover:bg-black cursor-pointer"
            >
              <Save className="w-4 h-4 mr-1.5 text-[#39ff14]" /> Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
