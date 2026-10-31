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
      }, 1500);
    } catch (err) {
      console.error("Payment failed:", err);
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start sm:items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="relative bg-white w-full max-w-2xl lg:max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl border border-zinc-200 flex flex-col max-h-[92vh] my-auto overflow-hidden">
        {/* Modal Sticky Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-zinc-100 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#39ff14] bg-[#0B192C] px-2.5 py-0.5 rounded-full border border-[#39ff14]/40">
              Subscription
            </span>
            <h2 className="text-sm sm:text-base font-black text-zinc-950">
              {paymentStep === "pay" ? "Checkout & Activation" : "Upgrade Restaurant Plan"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-5 flex-1 space-y-4">
          {/* STEP 1: PLAN SELECTION */}
          {paymentStep === "select" && (
            <>
              {highlightFeature && (
                <div className="p-2.5 sm:p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-amber-900 truncate">
                      Feature Locked: {highlightFeature}
                    </h4>
                    <p className="text-[11px] text-amber-700 leading-tight">
                      Upgrade to unlock this capability instantly for your restaurant.
                    </p>
                  </div>
                </div>
              )}

              {/* Monthly vs Annual Toggle */}
              <div className="text-center">
                <div className="inline-flex items-center p-0.5 rounded-xl bg-zinc-100 border border-zinc-200/80">
                  <button
                    type="button"
                    onClick={() => setBilling("monthly")}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      billing === "monthly"
                        ? "bg-white text-zinc-900 shadow-2xs"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBilling("yearly")}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      billing === "yearly"
                        ? "bg-[#0B192C] text-[#39ff14] shadow-2xs"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    Annual
                    <span className="text-[9px] font-black uppercase bg-[#39ff14]/20 text-[#39ff14] px-1 py-0.2 rounded">
                      2 Mo Free
                    </span>
                  </button>
                </div>
              </div>

              {/* Compact Plans Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(["starter", "pro", "enterprise"] as SubscriptionPlanId[]).map((planId) => {
                  const plan = SUBSCRIPTION_PLANS[planId];
                  const isCurrent = currentPlanId === planId;
                  const isPro = planId === "pro";
                  const displayPrice =
                    billing === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;

                  return (
                    <div
                      key={planId}
                      className={`relative rounded-2xl p-3.5 transition-all flex flex-col justify-between ${
                        isPro
                          ? "border-2 border-emerald-500 bg-emerald-50/25 shadow-sm ring-2 ring-emerald-500/10"
                          : "border border-zinc-200 bg-white hover:border-zinc-300"
                      }`}
                    >
                      {isPro && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#0B192C] text-[#39ff14] text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-[#39ff14]/40 tracking-wider">
                          Recommended
                        </span>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-black text-zinc-900">{plan.name}</h3>
                          {isCurrent && (
                            <span className="text-[9px] font-bold uppercase bg-zinc-100 text-zinc-600 px-1.5 py-0.2 rounded border border-zinc-200">
                              Active
                            </span>
                          )}
                        </div>

                        <div className="pb-2 border-b border-zinc-100">
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl sm:text-2xl font-black text-zinc-950">
                              ₹{displayPrice}
                            </span>
                            <span className="text-[10px] font-semibold text-zinc-500">/mo</span>
                          </div>
                          {billing === "yearly" && (
                            <p className="text-[10px] text-emerald-700 font-medium">
                              Billed ₹{plan.annualBilledAmount}/yr
                            </p>
                          )}
                        </div>

                        {/* Compact Quota List */}
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
                              Kitchen KDS & Alerts
                            </span>
                          </div>
                          <div className="text-zinc-800 font-medium flex items-center gap-1.5">
                            {plan.customDomain ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            )}
                            <span className={plan.customDomain ? "text-zinc-900 font-bold" : "text-zinc-400 line-through"}>
                              Custom Domain
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-zinc-100">
                        {isCurrent ? (
                          <Button
                            disabled
                            variant="outline"
                            size="sm"
                            className="w-full text-zinc-400 border-zinc-200 h-7 text-xs"
                          >
                            Current Plan
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleStartUpgrade(planId)}
                            variant="primary"
                            size="sm"
                            className={`w-full font-bold h-7 text-xs cursor-pointer ${
                              isPro
                                ? "bg-[#0B192C] hover:bg-black text-[#39ff14] border border-[#39ff14]/40"
                                : "bg-zinc-900 hover:bg-zinc-800 text-white"
                            }`}
                          >
                            Select Plan <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* STEP 2: PAYMENT CHECKOUT */}
          {paymentStep === "pay" && (
            <div className="max-w-md mx-auto py-1 space-y-3.5">
              <button
                onClick={() => setPaymentStep("select")}
                className="text-xs font-bold text-zinc-500 hover:text-zinc-900 inline-flex items-center gap-1 cursor-pointer"
              >
                ← Back to plans
              </button>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-zinc-950">
                    Confirm & Activate {targetPlan.name}
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Select payment mode to unlock instantly.
                  </p>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#0B192C] text-[#39ff14] border border-[#39ff14]/40">
                  {billing === "yearly" ? "Annual" : "Monthly"}
                </span>
              </div>

              {/* Bill Summary */}
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Base Subscription</span>
                  <span className="font-semibold text-zinc-900">₹{amountToPay}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>GST (18% inclusive)</span>
                  <span className="font-semibold text-zinc-900">₹{gstAmount}</span>
                </div>
                <div className="pt-1.5 border-t border-zinc-200 flex justify-between font-black text-zinc-950">
                  <span>Total Payable</span>
                  <span className="text-emerald-700 text-sm">₹{totalPayable}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Payment Method
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("upi")}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedMethod === "upi"
                        ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-600 mb-1" />
                    <div className="text-xs font-bold text-zinc-900">UPI QR Code</div>
                    <div className="text-[10px] text-zinc-500">GPay, PhonePe, Paytm</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod("card")}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedMethod === "card"
                        ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-600 mb-1" />
                    <div className="text-xs font-bold text-zinc-900">Card / Banking</div>
                    <div className="text-[10px] text-zinc-500">NetBanking & Cards</div>
                  </button>
                </div>
              </div>

              {selectedMethod === "upi" && (
                <div className="p-3 rounded-xl bg-[#0B192C] text-white flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-white p-0.5 shrink-0 flex items-center justify-center">
                    <div className="w-full h-full bg-[#0B192C] rounded flex items-center justify-center text-[#39ff14] text-[8px] font-black text-center p-0.5 leading-none">
                      MERA UPI
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#39ff14] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Razorpay Verified UPI
                    </div>
                    <div className="text-[11px] text-zinc-300 mt-0.5 truncate">
                      VPA: <span className="font-mono text-white font-bold">meraresto.pay@icici</span>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleCompletePayment}
                isLoading={processingPayment}
                size="md"
                className="w-full bg-[#0B192C] hover:bg-black text-[#39ff14] border border-[#39ff14]/40 font-bold text-xs cursor-pointer shadow-md"
              >
                Pay ₹{totalPayable} & Unlock Plan <Zap className="w-3.5 h-3.5 ml-1 fill-current" />
              </Button>
            </div>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {paymentStep === "success" && (
            <div className="py-6 text-center max-w-sm mx-auto animate-in zoom-in-95 space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h3 className="text-lg font-black text-zinc-900">
                Plan Successfully Activated!
              </h3>
              <p className="text-xs text-zinc-600">
                Your restaurant is now upgraded to{" "}
                <span className="font-bold text-emerald-700">{targetPlan.name}</span>. All quotas are updated.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
