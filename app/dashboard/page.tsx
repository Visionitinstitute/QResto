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
  Sparkles,
  ShieldCheck,
  CreditCard,
  Zap,
  Check,
  Lock,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { createClient } from "@/lib/supabase/client";
import { Hotel } from "@/types";
import {
  SUBSCRIPTION_PLANS,
  SubscriptionPlanId,
  BillingInterval,
  saveUserSubscription,
  getStoredSubscription,
  UserSubscription,
} from "@/lib/subscription";
import { PlanUpgradeModal } from "@/components/dashboard/PlanUpgradeModal";

export default function DashboardOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Onboarding wizard step: 1 = Restaurant Profile, 2 = Plan Selection, 3 = Payment Checkout, 4 = Success
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Restaurant Identity State
  const [hotelName, setHotelName] = useState("");
  const [slug, setSlug] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Step 2: Plan Selection State
  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPlanId>("pro");
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("monthly");

  // Step 3: Payment State
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [onboardingError, setOnboardingError] = useState<string | null>(null);

  // Stats state
  const [stats, setStats] = useState({
    pendingOrders: 0,
    todayOrders: 0,
    todaySales: 0,
    avgRating: 4.9,
    tableCount: 0,
    itemCount: 0,
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

          const sub = getStoredSubscription(user, hotelData?.id);
          setSubscription(sub);

          if (hotelData) {
            setHotel(hotelData);

            // If hotel exists but no subscription recorded, prompt step 2
            if (!sub) {
              setHotelName(hotelData.name || "");
              setSlug(hotelData.slug || "");
              setPhone(hotelData.phone || "");
              setAddress(hotelData.address || "");
              setOnboardingStep(2);
            }

            // Fetch metrics
            const [pendingRes, ordersRes, tablesRes, itemsRes] = await Promise.all([
              supabase
                .from("orders")
                .select("*", { count: "exact", head: true })
                .eq("hotel_id", hotelData.id)
                .eq("status", "pending"),
              supabase
                .from("orders")
                .select("total_amount, created_at, status")
                .eq("hotel_id", hotelData.id),
              supabase
                .from("tables")
                .select("*", { count: "exact", head: true })
                .eq("hotel_id", hotelData.id),
              supabase
                .from("menu_items")
                .select("*", { count: "exact", head: true })
                .eq("hotel_id", hotelData.id),
            ]);

            const allOrders = ordersRes.data || [];
            const totalOrders = allOrders.length;
            const totalSales = allOrders.reduce(
              (acc, curr) => acc + Number(curr.total_amount || 0),
              0
            );

            setStats({
              pendingOrders: pendingRes.count || 0,
              todayOrders: totalOrders,
              todaySales: totalSales,
              avgRating: 4.9,
              tableCount: tablesRes.count || 0,
              itemCount: itemsRes.count || 0,
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

    const handleSubUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<UserSubscription>;
      if (customEvent.detail) {
        setSubscription(customEvent.detail);
      }
    };
    window.addEventListener("meraresto:subscription-updated", handleSubUpdated);
    return () => {
      window.removeEventListener("meraresto:subscription-updated", handleSubUpdated);
    };
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

  // Step 1 Validation -> proceed to plan selection
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardingError(null);

    if (!hotelName.trim() || !slug.trim()) {
      setOnboardingError("Restaurant name and public URL slug are required.");
      return;
    }

    setOnboardingStep(2);
  };

  // Step 3: Complete Payment & Create/Activate Hotel
  const handleCompleteOnboardingAndPayment = async () => {
    setOnboardingError(null);
    setProcessingPayment(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setOnboardingError("You are not signed in. Please sign in again.");
        setProcessingPayment(false);
        return;
      }

      const plan = SUBSCRIPTION_PLANS[selectedPlanId];
      const basePrice =
        billingInterval === "yearly"
          ? plan.annualBilledAmount
          : plan.monthlyPrice;
      const gst = Math.round(basePrice * 0.18);
      const totalPayable = basePrice + gst;

      // 1. Create or retrieve Hotel
      let activeHotel = hotel;
      if (!activeHotel) {
        const { data: newHotel, error: hotelErr } = await supabase
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

        if (hotelErr) {
          if (hotelErr.code === "23505") {
            setOnboardingError(
              `The URL slug "${slug}" is already taken. Please choose a different restaurant slug in Step 1.`
            );
            setOnboardingStep(1);
          } else {
            setOnboardingError(hotelErr.message);
          }
          setProcessingPayment(false);
          return;
        }

        activeHotel = newHotel;
        setHotel(newHotel);
      }

      // 2. Save Subscription & Payment Metadata
      const savedSub = await saveUserSubscription(supabase, {
        planId: selectedPlanId,
        billing: billingInterval,
        amountPaid: totalPayable,
        paymentMethod: paymentMethod === "upi" ? "UPI QR (Instant Verified)" : "Card / NetBanking",
        hotelId: activeHotel?.id,
      });

      setSubscription(savedSub);
      setOnboardingStep(4);
    } catch (err: unknown) {
      setOnboardingError(
        err instanceof Error ? err.message : "Payment processing failed. Please try again."
      );
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-zinc-500">
          Loading MeraResto dashboard...
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MANDATORY PLAN SELECTION & PAYMENT ONBOARDING (USER RULE)
  // bina plan select kiye, bina pay kiye account na bne
  // -------------------------------------------------------------
  if (!hotel || !subscription || onboardingStep < 4 && !subscription) {
    const targetPlan = SUBSCRIPTION_PLANS[selectedPlanId];
    const basePrice =
      billingInterval === "yearly"
        ? targetPlan.annualBilledAmount
        : targetPlan.monthlyPrice;
    const gst = Math.round(basePrice * 0.18);
    const totalAmount = basePrice + gst;

    return (
      <div className="max-w-4xl mx-auto py-6 sm:py-10 px-3 sm:px-6">
        {/* Wizard Stepper Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-200 -translate-y-1/2 -z-0" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -translate-y-1/2 -z-0 transition-all duration-300"
              style={{
                width:
                  onboardingStep === 1
                    ? "0%"
                    : onboardingStep === 2
                    ? "50%"
                    : "100%",
              }}
            />

            {[
              { step: 1, label: "Restaurant Info" },
              { step: 2, label: "Select Plan" },
              { step: 3, label: "Payment & Activate" },
            ].map((s) => (
              <div
                key={s.step}
                className="relative z-10 flex flex-col items-center gap-1.5"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                    onboardingStep >= s.step
                      ? "bg-[#0B192C] text-[#39ff14] border border-[#39ff14]/50"
                      : "bg-white text-zinc-400 border border-zinc-200"
                  }`}
                >
                  {onboardingStep > s.step ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    s.step
                  )}
                </div>
                <span
                  className={`text-[11px] font-bold ${
                    onboardingStep >= s.step
                      ? "text-zinc-900"
                      : "text-zinc-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {onboardingError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 animate-in fade-in max-w-2xl mx-auto">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-red-700 font-medium leading-relaxed">
              {onboardingError}
            </p>
          </div>
        )}

        {/* STEP 1: RESTAURANT PROFILE DETAILS */}
        {onboardingStep === 1 && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-10 shadow-sm animate-in fade-in">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <Store className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
                Step 1: Set Up Restaurant Profile
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-zinc-500">
                Enter your restaurant details to create your customer QR menu
              </p>
            </div>

            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <label
                  htmlFor="hotelName"
                  className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5"
                >
                  Restaurant / Cafe Name *
                </label>
                <div className="relative">
                  <Input
                    id="hotelName"
                    type="text"
                    placeholder="e.g. Royal Spice Restaurant"
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
                  Public Menu URL Link (Slug) *
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
                  Customer menu address:{" "}
                  <span className="font-mono text-emerald-700 font-bold">
                    /menu/{slug || "restaurant-slug"}
                  </span>
                </p>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5"
                >
                  Contact Phone Number *
                </label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5"
                >
                  Restaurant Address & Location *
                </label>
                <div className="relative">
                  <Input
                    id="address"
                    type="text"
                    placeholder="Shop 12, Main Market, Connaught Place, New Delhi"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-4 bg-[#0B192C] hover:bg-black text-[#39ff14] border border-[#39ff14]/40 font-bold cursor-pointer"
              >
                Continue to Select Plan <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          </div>
        )}

        {/* STEP 2: CHOOSE SUBSCRIPTION PLAN */}
        {onboardingStep === 2 && (
          <div className="space-y-4 animate-in fade-in max-w-3xl mx-auto">
            <div className="text-center max-w-lg mx-auto">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#39ff14] bg-[#0B192C] px-2.5 py-0.5 rounded-full border border-[#39ff14]/40">
                Step 2: Choose Subscription
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight mt-2">
                Select Your Subscription Plan
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Mandatory plan selection required to unlock table limits and features for {hotelName || "your restaurant"}.
              </p>

              {/* Billing Cycle Toggle */}
              <div className="mt-3.5 inline-flex items-center p-0.5 rounded-xl bg-zinc-100 border border-zinc-200/80">
                <button
                  type="button"
                  onClick={() => setBillingInterval("monthly")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    billingInterval === "monthly"
                      ? "bg-white text-zinc-900 shadow-2xs"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  onClick={() => setBillingInterval("yearly")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    billingInterval === "yearly"
                      ? "bg-[#0B192C] text-[#39ff14] shadow-2xs"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  Annual Billing
                  <span className="text-[9px] font-black uppercase bg-[#39ff14]/20 text-[#39ff14] px-1 py-0.2 rounded">
                    2 Mo Free
                  </span>
                </button>
              </div>
            </div>

            {/* Plan Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(["starter", "pro", "enterprise"] as SubscriptionPlanId[]).map((planId) => {
                const plan = SUBSCRIPTION_PLANS[planId];
                const isSelected = selectedPlanId === planId;
                const isPro = planId === "pro";
                const displayPrice =
                  billingInterval === "yearly"
                    ? plan.yearlyPrice
                    : plan.monthlyPrice;

                return (
                  <div
                    key={planId}
                    onClick={() => setSelectedPlanId(planId)}
                    className={`relative rounded-2xl p-3.5 transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "border-2 border-emerald-500 bg-emerald-50/20 shadow-md ring-2 ring-emerald-500/10"
                        : "border border-zinc-200 bg-white hover:border-zinc-300"
                    }`}
                  >
                    {isPro && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#0B192C] text-[#39ff14] text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-[#39ff14]/40 tracking-wider">
                        Most Popular
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-black text-zinc-900">
                          {plan.name}
                        </h3>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="pb-2 border-b border-zinc-100">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl sm:text-2xl font-black text-zinc-950">
                            ₹{displayPrice}
                          </span>
                          <span className="text-[10px] font-semibold text-zinc-500">
                            / month
                          </span>
                        </div>
                        {billingInterval === "yearly" && (
                          <p className="text-[10px] text-emerald-700 font-medium">
                            Billed ₹{plan.annualBilledAmount}/yr
                          </p>
                        )}
                      </div>

                      {/* Quotas & Features */}
                      <div className="mt-2.5 space-y-1.5 text-[11px]">
                        <div className="text-zinc-800 font-medium flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Up to <strong>{plan.maxTables} Tables</strong></span>
                        </div>
                        <div className="text-zinc-800 font-medium flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Up to <strong>{plan.maxMenuItems} Dishes</strong></span>
                        </div>
                        <div className="text-zinc-800 font-medium flex items-center gap-1.5">
                          {plan.kdsEnabled ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          )}
                          <span className={plan.kdsEnabled ? "text-zinc-900 font-bold" : "text-zinc-400 line-through"}>
                            Live Kitchen KDS
                          </span>
                        </div>
                        <div className="text-zinc-800 font-medium flex items-center gap-1.5">
                          {plan.soundAlerts ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          )}
                          <span className={plan.soundAlerts ? "text-zinc-900 font-bold" : "text-zinc-400 line-through"}>
                            Audio Chimes
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-zinc-100">
                      <div
                        className={`text-center py-1.5 rounded-lg text-xs font-bold transition ${
                          isSelected
                            ? "bg-emerald-600 text-white"
                            : "bg-zinc-100 text-zinc-700"
                        }`}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Back / Next buttons */}
            <div className="flex items-center justify-between pt-2 max-w-sm mx-auto">
              <button
                type="button"
                onClick={() => setOnboardingStep(1)}
                className="text-xs font-bold text-zinc-600 hover:text-zinc-900 cursor-pointer"
              >
                ← Back
              </button>

              <Button
                onClick={() => setOnboardingStep(3)}
                variant="primary"
                size="md"
                className="bg-[#0B192C] hover:bg-black text-[#39ff14] border border-[#39ff14]/40 font-bold cursor-pointer text-xs h-8 px-4"
              >
                Proceed to Payment <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: SECURE PAYMENT & ACTIVATION CHECKOUT */}
        {onboardingStep === 3 && (
          <div className="max-w-xl mx-auto bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-10 shadow-sm animate-in fade-in">
            <button
              onClick={() => setOnboardingStep(2)}
              className="text-xs font-bold text-zinc-500 hover:text-zinc-900 mb-4 inline-flex items-center gap-1 cursor-pointer"
            >
              ← Back to plans
            </button>

            <div className="text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#39ff14] bg-[#0B192C] px-3.5 py-1.5 rounded-full border border-[#39ff14]/40">
                Step 3: Secure Payment
              </span>
              <h2 className="text-2xl font-black text-zinc-950 tracking-tight mt-3">
                Complete Payment & Activate
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Your restaurant account will be activated immediately upon payment.
              </p>
            </div>

            {/* Order Invoice Summary */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2 mb-6">
              <div className="flex justify-between text-xs text-zinc-600">
                <span>Restaurant Name</span>
                <span className="font-bold text-zinc-900">{hotelName || hotel?.name}</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-600">
                <span>
                  Plan: {targetPlan.name} ({billingInterval === "yearly" ? "Annual" : "Monthly"})
                </span>
                <span className="font-semibold text-zinc-900">₹{basePrice}</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-600">
                <span>GST (18% inclusive/breakup)</span>
                <span className="font-semibold text-zinc-900">₹{gst}</span>
              </div>
              <div className="pt-2 border-t border-zinc-200 flex justify-between text-sm font-black text-zinc-950">
                <span>Total Amount Payable</span>
                <span className="text-emerald-700 text-base">₹{totalAmount}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                Select Payment Method
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentMethod === "upi"
                      ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-600 mb-1" />
                  <div className="text-xs font-bold text-zinc-900">UPI QR Code</div>
                  <div className="text-[10px] text-zinc-500">GPay, PhonePe, Paytm</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentMethod === "card"
                      ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-emerald-600 mb-1" />
                  <div className="text-xs font-bold text-zinc-900">Cards & NetBanking</div>
                  <div className="text-[10px] text-zinc-500">All major banks supported</div>
                </button>
              </div>
            </div>

            {paymentMethod === "upi" && (
              <div className="p-4 rounded-2xl bg-[#0B192C] text-white flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-white p-1 shrink-0 flex items-center justify-center">
                  <div className="w-full h-full bg-[#0B192C] rounded-lg flex items-center justify-center text-[#39ff14] text-[9px] font-black text-center p-1 leading-tight">
                    MERARESTO UPI
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#39ff14] flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Razorpay Verified UPI
                  </div>
                  <div className="text-[11px] text-zinc-300 mt-0.5">
                    UPI ID: <span className="font-mono text-white font-bold">meraresto.pay@icici</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    Click button below to simulate immediate gateway authorization.
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleCompleteOnboardingAndPayment}
              isLoading={processingPayment}
              size="lg"
              className="w-full bg-[#0B192C] hover:bg-black text-[#39ff14] border border-[#39ff14]/40 font-bold text-sm cursor-pointer shadow-lg shadow-black/10"
            >
              Pay ₹{totalAmount} & Activate Restaurant <Zap className="w-4 h-4 ml-1 fill-current" />
            </Button>
          </div>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION RECEIPT */}
        {onboardingStep === 4 && (
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-zinc-200/80 p-8 text-center animate-in zoom-in-95 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h2 className="text-2xl font-black text-zinc-900">
              Account Activated!
            </h2>
            <p className="text-xs text-zinc-600 mt-2">
              Your payment of <span className="font-bold text-zinc-900">₹{subscription?.amountPaid}</span> was verified. Your restaurant is now live on the{" "}
              <span className="font-bold text-emerald-700">{subscription?.plan.name}</span> plan.
            </p>

            <div className="my-6 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500">Transaction ID:</span>
                <span className="font-mono font-bold text-zinc-900">{subscription?.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Max Tables Quota:</span>
                <span className="font-bold text-zinc-900">{subscription?.plan.maxTables} Tables</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Max Dishes Quota:</span>
                <span className="font-bold text-zinc-900">{subscription?.plan.maxMenuItems} Dishes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Kitchen Display (KDS):</span>
                <span className={`font-bold ${subscription?.plan.kdsEnabled ? "text-emerald-700" : "text-zinc-400"}`}>
                  {subscription?.plan.kdsEnabled ? "Unlocked (Live Alerts)" : "Locked (Starter)"}
                </span>
              </div>
            </div>

            <Button
              onClick={() => window.location.reload()}
              size="lg"
              className="w-full bg-[#0B192C] hover:bg-black text-[#39ff14] border border-[#39ff14]/40 font-bold"
            >
              Enter Dashboard Overview <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // ACTIVE DASHBOARD OVERVIEW WITH PLAN QUOTAS & USAGE HEALTH
  // -------------------------------------------------------------
  const activePlan = subscription.plan;
  const tablePercent = Math.min(100, Math.round((stats.tableCount / activePlan.maxTables) * 100));
  const itemPercent = Math.min(100, Math.round((stats.itemCount / activePlan.maxMenuItems) * 100));

  return (
    <div className="space-y-6">
      {/* Plan Upgrade Modal */}
      <PlanUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        currentPlanId={subscription.planId}
        onPlanUpdated={(newSub) => setSubscription(newSub)}
      />

      {/* Clean Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200/80">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
              {hotel.name}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0B192C] text-[#39ff14] text-[11px] font-bold border border-[#39ff14]/40">
              <Sparkles className="w-3 h-3" /> {activePlan.name} Plan
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Live
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Dashboard Overview • Live orders, menu & table QR codes
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => setIsUpgradeModalOpen(true)}
            variant="outline"
            size="sm"
            className="text-xs font-bold border-zinc-300 hover:bg-zinc-100 cursor-pointer"
          >
            Manage Plan
          </Button>

          <Link
            href={`/menu/${hotel.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold text-xs shadow-2xs transition"
          >
            <span>Open Customer Menu</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* PLAN QUOTAS & CAPACITY HEALTH BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white rounded-2xl border border-zinc-200/80 p-4 shadow-2xs">
        {/* Table Quota */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-zinc-700 flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-zinc-500" /> Dining Tables
            </span>
            <span className="font-bold text-zinc-900">
              {stats.tableCount} / {activePlan.maxTables}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                tablePercent >= 90 ? "bg-red-500" : "bg-emerald-500"
              }`}
              style={{ width: `${tablePercent}%` }}
            />
          </div>
          <p className="text-[10px] text-zinc-400 mt-1">
            {activePlan.maxTables - stats.tableCount} tables remaining in {activePlan.name}
          </p>
        </div>

        {/* Menu Items Quota */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-zinc-700 flex items-center gap-1.5">
              <ChefHat className="w-3.5 h-3.5 text-zinc-500" /> Menu Dishes
            </span>
            <span className="font-bold text-zinc-900">
              {stats.itemCount} / {activePlan.maxMenuItems}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                itemPercent >= 90 ? "bg-red-500" : "bg-emerald-500"
              }`}
              style={{ width: `${itemPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-zinc-400 mt-1">
            {activePlan.maxMenuItems - stats.itemCount} items remaining in {activePlan.name}
          </p>
        </div>

        {/* Kitchen KDS Status */}
        <div className="flex items-center justify-between pl-0 md:pl-4 border-t md:border-t-0 md:border-l border-zinc-100 pt-3 md:pt-0">
          <div>
            <span className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
              <UtensilsCrossed className="w-3.5 h-3.5 text-zinc-500" /> Kitchen Display (KDS)
            </span>
            <p className="text-xs font-bold text-zinc-900 mt-0.5">
              {activePlan.kdsEnabled ? "Live Alert Station (Active)" : "Locked (Upgrade Needed)"}
            </p>
          </div>
          {!activePlan.kdsEnabled && (
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
            >
              Unlock KDS
            </button>
          )}
        </div>
      </div>

      {/* Key Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        <Card className="p-3.5 sm:p-4 flex items-center justify-between border-zinc-200/80 shadow-2xs hover:shadow-xs transition">
          <div>
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Pending Orders
            </p>
            <p className="text-xl sm:text-2xl font-bold text-orange-600 mt-0.5">
              {stats.pendingOrders}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </Card>

        <Card className="p-3.5 sm:p-4 flex items-center justify-between border-zinc-200/80 shadow-2xs hover:shadow-xs transition">
          <div>
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Orders Today
            </p>
            <p className="text-xl sm:text-2xl font-bold text-zinc-900 mt-0.5">
              {stats.todayOrders}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
        </Card>

        <Card className="p-3.5 sm:p-4 flex items-center justify-between border-zinc-200/80 shadow-2xs hover:shadow-xs transition">
          <div>
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Revenue
            </p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-0.5">
              ₹{stats.todaySales}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </Card>

        <Card className="p-3.5 sm:p-4 flex items-center justify-between border-zinc-200/80 shadow-2xs hover:shadow-xs transition">
          <div>
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Rating
            </p>
            <p className="text-xl sm:text-2xl font-bold text-amber-500 mt-0.5">
              {stats.avgRating} <span className="text-[11px] font-normal text-zinc-400">/ 5</span>
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
            <Star className="w-4 h-4" />
          </div>
        </Card>
      </div>

      {/* Quick Action Navigation Grid */}
      <div>
        <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2.5">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/dashboard/orders"
            className="p-3.5 sm:p-4 rounded-xl bg-white border border-zinc-200/80 hover:border-emerald-300 hover:shadow-xs transition flex items-start gap-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-xs sm:text-sm group-hover:text-emerald-700 transition">
                Live Kitchen Orders
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5 leading-snug">
                Monitor incoming orders in realtime and update cooking status.
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/menu"
            className="p-3.5 sm:p-4 rounded-xl bg-white border border-zinc-200/80 hover:border-emerald-300 hover:shadow-xs transition flex items-start gap-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-xs sm:text-sm group-hover:text-emerald-700 transition">
                Menu & Dishes
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5 leading-snug">
                Manage dishes, adjust prices, and toggle in-stock availability.
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/qr"
            className="p-3.5 sm:p-4 rounded-xl bg-white border border-zinc-200/80 hover:border-emerald-300 hover:shadow-xs transition flex items-start gap-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-xs sm:text-sm group-hover:text-emerald-700 transition">
                Table QR Codes
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5 leading-snug">
                Generate, export and print custom QR standees for every table.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
