"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Download,
  AlertCircle,
  TrendingUp,
  Layers,
  ArrowLeft,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Modal } from "@meraresto/ui";
import { formatCurrency, PLAN_QUOTAS } from "@meraresto/utils";

interface InvoiceReceipt {
  id: string;
  date: string;
  plan: string;
  amount: number;
  status: "PAID" | "PENDING";
}

const SAMPLE_INVOICES: InvoiceReceipt[] = [
  { id: "INV-2026-003", date: "15 Oct 2026", plan: "Pro Resto Plan", amount: 999, status: "PAID" },
  { id: "INV-2026-002", date: "15 Sep 2026", plan: "Pro Resto Plan", amount: 999, status: "PAID" },
  { id: "INV-2026-001", date: "15 Aug 2026", plan: "Pro Resto Plan", amount: 999, status: "PAID" },
];

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState<"starter" | "pro" | "enterprise">("pro");
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<"pro" | "enterprise">("enterprise");
  const [isProcessing, setIsProcessing] = useState(false);

  const planInfo = PLAN_QUOTAS[currentPlan];

  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/payments/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedUpgradePlan,
          restaurantId: "balkumari",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCurrentPlan(selectedUpgradePlan);
        setIsUpgradeOpen(false);
      }
    } catch {
      setCurrentPlan(selectedUpgradePlan);
      setIsUpgradeOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/settings"
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Settings
            </Link>
          </div>
          <h2 className="text-xl font-bold text-[#0B192C]">Subscription & Billing</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage your subscription tier, quota limits, and payment receipts.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsUpgradeOpen(true)}
          className="bg-[#0B192C] hover:bg-zinc-800 text-white text-xs"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1 text-[#0E8388]" />
          Upgrade Plan
        </Button>
      </div>

      {/* Active Subscription Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="md:col-span-2 border-2 border-[#0E8388]/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#0E8388] uppercase tracking-wider block">
                Current Active Subscription
              </span>
              <CardTitle className="text-xl font-extrabold text-zinc-900 mt-1">
                {planInfo.name}
              </CardTitle>
            </div>
            <Badge variant="success" className="px-2.5 py-1 text-xs">
              Active • Auto-renews
            </Badge>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0B192C]">
                {formatCurrency(planInfo.monthlyPrice)}
              </span>
              <span className="text-xs text-zinc-500">per month (billed monthly)</span>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              Your plan includes unlimited QR codes, real-time Kitchen Display (KDS),
              and sound alerts. Next billing date is <strong>15 November 2026</strong>.
            </p>

            {/* Quota Progress */}
            <div className="space-y-3 pt-3 border-t border-zinc-100 text-xs">
              <div>
                <div className="flex justify-between mb-1 text-zinc-700 font-medium">
                  <span>Dining Tables Quota</span>
                  <span>16 / {planInfo.maxTables} used</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className="h-full bg-[#0E8388] rounded-full"
                    style={{ width: `${(16 / planInfo.maxTables) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-zinc-700 font-medium">
                  <span>Staff Team Members</span>
                  <span>3 / {planInfo.maxStaff} used</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${(3 / planInfo.maxStaff) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Card */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#0E8388]" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                <span className="text-xs font-bold text-zinc-900 block">
                  Razorpay AutoPay (UPI / Card)
                </span>
                <span className="text-[11px] text-zinc-500 block mt-0.5">
                  Mandate active via HDFC Bank •••• 4242
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Invoices and tax receipts are automatically sent to your registered owner email.
              </p>
            </CardContent>
          </div>

          <div className="p-4 border-t border-zinc-100">
            <span className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> 256-bit Secure Encryption
            </span>
          </div>
        </Card>
      </div>

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold text-zinc-900">
            Recent Tax Invoices & Receipts
          </CardTitle>
          <p className="text-xs text-zinc-500 mt-0.5">
            Download GST-compliant invoices for your accounting records.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left text-xs">
            <thead className="border-y border-zinc-100 bg-zinc-50/50 text-zinc-500 font-medium">
              <tr>
                <th className="py-3 px-6">Invoice #</th>
                <th className="py-3 px-6">Billing Date</th>
                <th className="py-3 px-6">Plan Description</th>
                <th className="py-3 px-6">Amount (INR)</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {SAMPLE_INVOICES.map((inv) => (
                <tr key={inv.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-3.5 px-6 font-mono font-semibold text-zinc-900">
                    {inv.id}
                  </td>
                  <td className="py-3.5 px-6 text-zinc-600">{inv.date}</td>
                  <td className="py-3.5 px-6 font-medium text-zinc-800">{inv.plan}</td>
                  <td className="py-3.5 px-6 font-bold text-zinc-900">
                    {formatCurrency(inv.amount)}
                  </td>
                  <td className="py-3.5 px-6">
                    <Badge variant="success">PAID</Badge>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => alert(`Downloading ${inv.id}.pdf...`)}
                      className="text-xs font-semibold text-[#0E8388] hover:underline inline-flex items-center gap-1"
                    >
                      <Download className="h-3.5 w-3.5" />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Upgrade Plan Modal */}
      <Modal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        title="Upgrade MeraResto Subscription"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <p className="text-xs text-zinc-600">
            Select an upgraded tier to increase table capacity, add staff logins, and access multi-chain features:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pro Plan */}
            <div
              onClick={() => setSelectedUpgradePlan("pro")}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedUpgradePlan === "pro"
                  ? "border-[#0E8388] bg-teal-50/40"
                  : "border-zinc-200 bg-white hover:border-zinc-300"
              }`}
            >
              <span className="text-xs font-bold text-zinc-900 block">Pro Resto</span>
              <span className="text-xl font-black text-[#0B192C] block mt-1">₹999 / mo</span>
              <ul className="mt-3 space-y-1.5 text-xs text-zinc-600">
                <li>✓ Up to 50 dining tables</li>
                <li>✓ Kitchen Display (KDS) & audio</li>
                <li>✓ 10 staff member logins</li>
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div
              onClick={() => setSelectedUpgradePlan("enterprise")}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedUpgradePlan === "enterprise"
                  ? "border-[#0E8388] bg-teal-50/40"
                  : "border-zinc-200 bg-white hover:border-zinc-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900 block">Enterprise</span>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                  Multi-Branch
                </span>
              </div>
              <span className="text-xl font-black text-[#0B192C] block mt-1">₹2,499 / mo</span>
              <ul className="mt-3 space-y-1.5 text-xs text-zinc-600">
                <li>✓ Up to 200 tables & multi-outlet</li>
                <li>✓ Custom domain branding</li>
                <li>✓ 50 staff logins & role RBAC</li>
                <li>✓ Dedicated account manager</li>
              </ul>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-zinc-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsUpgradeOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleUpgrade}
              isLoading={isProcessing}
              className="bg-[#0B192C] hover:bg-zinc-800 text-white"
            >
              Confirm Upgrade to {selectedUpgradePlan === "enterprise" ? "Enterprise" : "Pro"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

