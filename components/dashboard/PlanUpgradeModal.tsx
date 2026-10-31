"use client";

import { useState } from "react";
import {
  Check,
  Sparkles,
  ShieldCheck,
  CreditCard,
  QrCode,
  Zap,
  ArrowRight,
  X,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  SUBSCRIPTION_PLANS,
  SubscriptionPlanId,
  BillingInterval,
  saveUserSubscription,
  UserSubscription,
} from "@/lib/subscription";
import { createClient } from "@/lib/supabase/client";

interface PlanUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlanId?: SubscriptionPlanId;
  onPlanUpdated?: (subscription: UserSubscription) => void;
  highlightFeature?: string;
}

export function PlanUpgradeModal({
  isOpen,
  onClose,
  currentPlanId = "starter",
  onPlanUpdated,
  highlightFeature,
}: PlanUpgradeModalProps) {
  const [billing, setBilling] = useState<BillingInterval>("monthly");
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanId>("pro");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"select" | "pay" | "success">("select");
  const [selectedMethod, setSelectedMethod] = useState<"upi" | "card">("upi");
  const [processingPayment, setProcessingPayment] = useState(false);

  if (!isOpen) return null;

  const targetPlan = SUBSCRIPTION_PLANS[selectedPlan];
  const amountToPay =
    billing === "yearly"
      ? targetPlan.annualBilledAmount
      : targetPlan.monthlyPrice;
  const gstAmount = Math.round(amountToPay * 0.18);
  const totalPayable = amountToPay + gstAmount;

  const handleStartUpgrade = (planId: SubscriptionPlanId) => {
    setSelectedPlan(planId);
    setPaymentStep("pay");
  };

  const handleCompletePayment = async () => {
    setProcessingPayment(true);
    try {
      const supabase = createClient();
      const updatedSub = await saveUserSubscription(supabase, {
        planId: selectedPlan,
        billing,
        amountPaid: totalPayable,
        paymentMethod: selectedMethod === "upi" ? "UPI QR (Instant Verified)" : "Card / NetBanking",
      });

      setPaymentStep("success");
      if (onPlanUpdated) {
        onPlanUpdated(updatedSub);
      }
      setTimeout(() => {
        setPaymentStep("select");
        onClose();
      }, 1800);
    } catch (err) {
      console.error("Payment failed:", err);
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: PLAN SELECTION */}
        {paymentStep === "select" && (
          <div className="p-6 sm:p-10">
            {highlightFeature && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-900">
                    Feature Locked: {highlightFeature}
                  </h4>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Upgrade to an eligible plan to instantly unlock this capability for your restaurant.
                  </p>
                </div>
              </div>
            )}

            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-[#39ff14] bg-[#0B192C] px-3.5 py-1.5 rounded-full border border-[#39ff14]/40">
                Subscription & Upgrades
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-3">
                Upgrade Your Restaurant Plan
              </h2>
              <p className="text-sm text-zinc-600 mt-2">
                Unlock more tables, live kitchen displays, and advanced operations
              </p>

              {/* Monthly vs Annual Toggle */}
              <div className="mt-6 inline-flex items-center p-1 rounded-2xl bg-zinc-100 border border-zinc-200/80">
                <button
                  type="button"
                  onClick={() => setBilling("monthly")}
                  className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    billing === "monthly"
                      ? "bg-white text-zinc-900 shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  onClick={() => setBilling("yearly")}
                  className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    billing === "yearly"
                      ? "bg-[#0B192C] text-[#39ff14] shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  Annual Billing
                  <span className="text-[10px] font-black uppercase bg-[#39ff14]/20 text-[#39ff14] px-1.5 py-0.5 rounded-md">
                    2 Mo Free
                  </span>
                </button>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
              {(["starter", "pro", "enterprise"] as SubscriptionPlanId[]).map((planId) => {
                const plan = SUBSCRIPTION_PLANS[planId];
                const isCurrent = currentPlanId === planId;
                const isPro = planId === "pro";
                const displayPrice =
                  billing === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;

                return (
                  <div
                    key={planId}
                    className={`relative rounded-3xl p-6 transition-all flex flex-col justify-between ${
                      isPro
                        ? "border-2 border-emerald-500 bg-emerald-50/20 shadow-lg shadow-emerald-500/5 ring-4 ring-emerald-500/10"
                        : "border border-zinc-200 bg-white hover:border-zinc-300"
                    }`}
                  >
                    {isPro && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0B192C] text-[#39ff14] text-[10px] font-black uppercase px-3 py-1 rounded-full border border-[#39ff14]/40 tracking-wider">
                        Recommended
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-black text-zinc-900">{plan.name}</h3>
                        {isCurrent && (
                          <span className="text-[10px] font-bold uppercase bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md border border-zinc-200">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 min-h-[32px]">{plan.tagline}</p>

                      <div className="mt-4 pb-4 border-b border-zinc-100">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-zinc-950">
                            ₹{displayPrice}
                          </span>
                          <span className="text-xs font-semibold text-zinc-500">/ month</span>
                        </div>
                        {billing === "yearly" && (
                          <p className="text-[11px] text-emerald-700 font-medium mt-1">
                            Billed annually (₹{plan.annualBilledAmount}/yr)
                          </p>
                        )}
                      </div>

                      <div className="mt-4 space-y-2.5">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                          Quota & Capabilities:
                        </p>
                        <div className="text-xs font-semibold text-zinc-800 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Up to <span className="font-bold">{plan.maxTables} tables</span> & QR codes
                        </div>
                        <div className="text-xs font-semibold text-zinc-800 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Up to <span className="font-bold">{plan.maxMenuItems} menu dishes</span>
                        </div>
                        <div className="text-xs font-semibold text-zinc-800 flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${plan.kdsEnabled ? "bg-emerald-500" : "bg-zinc-300"}`} />
                          <span className={plan.kdsEnabled ? "text-zinc-900 font-bold" : "text-zinc-400 line-through"}>
                            Kitchen Display System (KDS)
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-zinc-800 flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${plan.soundAlerts ? "bg-emerald-500" : "bg-zinc-300"}`} />
                          <span className={plan.soundAlerts ? "text-zinc-900 font-bold" : "text-zinc-400 line-through"}>
                            Audio Order Chimes
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-zinc-800 flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${plan.customDomain ? "bg-emerald-500" : "bg-zinc-300"}`} />
                          <span className={plan.customDomain ? "text-zinc-900 font-bold" : "text-zinc-400 line-through"}>
                            Custom Domain Branding
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-zinc-100">
                      {isCurrent ? (
                        <Button
                          disabled
                          variant="outline"
                          size="sm"
                          className="w-full text-zinc-400 border-zinc-200"
                        >
                          Active Plan
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleStartUpgrade(planId)}
                          variant="primary"
                          size="sm"
                          className={`w-full font-bold cursor-pointer ${
                            isPro
                              ? "bg-[#0B192C] hover:bg-black text-[#39ff14] border border-[#39ff14]/40"
                              : "bg-zinc-900 hover:bg-zinc-800 text-white"
                          }`}
                        >
                          Select {plan.name} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: PAYMENT CHECKOUT */}
        {paymentStep === "pay" && (
          <div className="p-6 sm:p-10 max-w-xl mx-auto">
            <button
              onClick={() => setPaymentStep("select")}
              className="text-xs font-bold text-zinc-500 hover:text-zinc-900 mb-4 inline-flex items-center gap-1 cursor-pointer"
            >
              ← Back to plans
            </button>

            <h3 className="text-2xl font-black text-zinc-950">
              Confirm & Activate {targetPlan.name}
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Select your payment method below to complete activation.
            </p>

            {/* Bill Summary */}
            <div className="mt-6 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
              <div className="flex justify-between text-xs text-zinc-600">
                <span>
                  {targetPlan.name} ({billing === "yearly" ? "1 Year" : "1 Month"})
                </span>
                <span className="font-semibold text-zinc-900">₹{amountToPay}</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-600">
                <span>GST (18% inclusive/breakup)</span>
                <span className="font-semibold text-zinc-900">₹{gstAmount}</span>
              </div>
              <div className="pt-2 border-t border-zinc-200 flex justify-between text-sm font-black text-zinc-950">
                <span>Total Amount Payable</span>
                <span className="text-emerald-700">₹{totalPayable}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mt-6 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                Select Payment Method
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMethod("upi")}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedMethod === "upi"
                      ? "border-emerald-600 bg-emerald-50/30 ring-2 ring-emerald-500/20"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-600 mb-1.5" />
                  <div className="text-xs font-bold text-zinc-900">Instant UPI QR</div>
                  <div className="text-[10px] text-zinc-500">GPay, PhonePe, Paytm</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod("card")}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedMethod === "card"
                      ? "border-emerald-600 bg-emerald-50/30 ring-2 ring-emerald-500/20"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-emerald-600 mb-1.5" />
                  <div className="text-xs font-bold text-zinc-900">Card / NetBanking</div>
                  <div className="text-[10px] text-zinc-500">Debit, Credit & NetBanking</div>
                </button>
              </div>
            </div>

            {selectedMethod === "upi" && (
              <div className="mt-5 p-4 rounded-2xl bg-zinc-900 text-white flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white p-1 shrink-0 flex items-center justify-center">
                  <div className="w-full h-full bg-[#0B192C] rounded-lg flex items-center justify-center text-[#39ff14] text-[10px] font-black text-center p-1 leading-tight">
                    MERARESTO UPI
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#39ff14] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Razorpay Verified UPI Gateway
                  </div>
                  <div className="text-[11px] text-zinc-300 mt-1">
                    VPA: <span className="font-mono text-white font-bold">meraresto.pay@icici</span>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleCompletePayment}
              isLoading={processingPayment}
              size="lg"
              className="w-full mt-6 bg-[#0B192C] hover:bg-black text-[#39ff14] border border-[#39ff14]/40 font-bold cursor-pointer"
            >
              Pay ₹{totalPayable} & Unlock Plan <Zap className="w-4 h-4 ml-1 fill-current" />
            </Button>
          </div>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION */}
        {paymentStep === "success" && (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="text-2xl font-black text-zinc-900">
              Plan Successfully Activated!
            </h3>
            <p className="text-xs text-zinc-600 mt-2">
              Your restaurant has been upgraded to{" "}
              <span className="font-bold text-emerald-700">{targetPlan.name}</span>. All quotas and features are now unlocked!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

