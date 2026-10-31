"use client";

import React, { useState } from "react";
import {
  Building2,
  Users,
  CreditCard,
  Activity,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Settings,
  ShieldCheck,
  Filter,
  DollarSign,
  Layers,
  Lock,
  Edit2,
  Trash2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Modal, Input } from "@meraresto/ui";
import { formatCurrency } from "@meraresto/utils";

interface TenantRecord {
  id: string;
  name: string;
  slug: string;
  ownerEmail: string;
  plan: "Starter" | "Pro" | "Enterprise";
  status: "ACTIVE" | "TRIAL" | "SUSPENDED";
  tablesCount: number;
  monthlyRevenue: number;
  joinedAt: string;
}

interface PlanItem {
  id: string;
  name: string;
  monthlyPrice: number;
  maxTables: number;
  maxStaff: number;
  features: string[];
}

const INITIAL_TENANTS: TenantRecord[] = [
  {
    id: "rst-001",
    name: "Balkumari Restaurant & Cafe",
    slug: "balkumari",
    ownerEmail: "owner@balkumari.com",
    plan: "Pro",
    status: "ACTIVE",
    tablesCount: 16,
    monthlyRevenue: 999,
    joinedAt: "2026-10-15",
  },
  {
    id: "rst-002",
    name: "Royal Spice Bistro",
    slug: "royal-spice",
    ownerEmail: "contact@royalspice.in",
    plan: "Enterprise",
    status: "ACTIVE",
    tablesCount: 45,
    monthlyRevenue: 2499,
    joinedAt: "2026-09-28",
  },
  {
    id: "rst-003",
    name: "Chai Shai Cafe",
    slug: "chaishai",
    ownerEmail: "chai@chaishai.co",
    plan: "Starter",
    status: "TRIAL",
    tablesCount: 6,
    monthlyRevenue: 0,
    joinedAt: "2026-10-27",
  },
  {
    id: "rst-004",
    name: "Himalayan Momo House",
    slug: "himalayan-momo",
    ownerEmail: "info@himalayanmomo.com",
    plan: "Pro",
    status: "ACTIVE",
    tablesCount: 12,
    monthlyRevenue: 999,
    joinedAt: "2026-10-20",
  },
];

const SUBSCRIPTION_PLANS: PlanItem[] = [
  {
    id: "starter",
    name: "Starter Free",
    monthlyPrice: 0,
    maxTables: 10,
    maxStaff: 2,
    features: ["Up to 10 tables", "Digital QR Menu", "Standard Order View", "Community Support"],
  },
  {
    id: "pro",
    name: "Pro Resto",
    monthlyPrice: 999,
    maxTables: 50,
    maxStaff: 10,
    features: [
      "Unlimited Tables & QR codes",
      "Live Kitchen Display (KDS)",
      "Sound Alerts & Audio Chime",
      "Item Variants & Add-ons",
      "Priority WhatsApp Support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Multi-Chain",
    monthlyPrice: 2499,
    maxTables: 200,
    maxStaff: 50,
    features: [
      "Multi-outlet Centralized Hub",
      "Custom Domain Support",
      "Dedicated Account Manager",
      "Audit Trails & Compliance",
      "Unlimited KDS Screens",
    ],
  },
];

export default function SuperAdminDashboard() {
  const [tenants, setTenants] = useState<TenantRecord[]>(INITIAL_TENANTS);
  const [activeTab, setActiveTab] = useState<"tenants" | "plans" | "audit">("tenants");
  const [search, setSearch] = useState("");
  const [editingTenant, setEditingTenant] = useState<TenantRecord | null>(null);

  const toggleTenantStatus = (id: string) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const newStatus = t.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
        return { ...t, status: newStatus };
      })
    );
  };

  const handleUpdatePlan = (newPlan: "Starter" | "Pro" | "Enterprise") => {
    if (!editingTenant) return;
    const priceMap = { Starter: 0, Pro: 999, Enterprise: 2499 };
    setTenants((prev) =>
      prev.map((t) =>
        t.id === editingTenant.id
          ? { ...t, plan: newPlan, monthlyRevenue: priceMap[newPlan] }
          : t
      )
    );
    setEditingTenant(null);
  };

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase()) ||
      t.ownerEmail.toLowerCase().includes(search.toLowerCase())
  );

  const totalMRR = tenants.reduce((sum, t) => sum + (t.status === "ACTIVE" ? t.monthlyRevenue : 0), 0);
  const totalTables = tenants.reduce((sum, t) => sum + t.tablesCount, 0);

  const stats = [
    { label: "Active Restaurants", value: `${tenants.filter((t) => t.status === "ACTIVE").length} / ${tenants.length}`, change: "92% active rate", icon: Building2, color: "text-[#0E8388] bg-teal-50" },
    { label: "Current Platform MRR", value: formatCurrency(totalMRR), change: "+24% this month", icon: CreditCard, color: "text-emerald-600 bg-emerald-50" },
    { label: "Total Active Tables", value: `${totalTables} tables`, change: "Across all tenants", icon: Activity, color: "text-blue-600 bg-blue-50" },
    { label: "Platform Uptime", value: "99.98%", change: "Zero incidents today", icon: ShieldCheck, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#0B192C]">
      {/* Top Header */}
      <header className="border-b border-zinc-200/80 bg-white px-6 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B192C] text-white shadow-2xs">
            <ShieldCheck className="h-5 w-5 text-[#0E8388]" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-[#0B192C] leading-none">
              Mera<span className="text-[#0E8388]">Resto</span> Super Admin
            </h1>
            <span className="text-[11px] text-zinc-400 font-medium">
              Multi-Tenant Cloud Operations
            </span>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("tenants")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "tenants"
                ? "bg-[#0B192C] text-white shadow-2xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Tenants Directory
          </button>
          <button
            onClick={() => setActiveTab("plans")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "plans"
                ? "bg-[#0B192C] text-white shadow-2xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Subscription Plans
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s, idx) => (
            <Card key={idx}>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-zinc-500">{s.label}</p>
                  <p className="text-2xl font-bold text-zinc-900 mt-1">{s.value}</p>
                  <span className="text-[11px] text-zinc-500 font-medium">{s.change}</span>
                </div>
                <div className={`p-3 rounded-xl ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* TAB 1: Tenants Directory */}
        {activeTab === "tenants" && (
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-bold text-zinc-900">
                  Restaurant Organizations
                </CardTitle>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Monitor tenant subscriptions, table quotas, and operational status.
                </p>
              </div>

              <div className="w-full sm:w-72 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search restaurant or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl bg-zinc-50 border border-zinc-200 pl-9 pr-3 py-1.5 text-xs text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:outline-hidden focus:border-[#0E8388]"
                />
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-y border-zinc-100 bg-zinc-50/50 text-zinc-500 font-medium">
                    <tr>
                      <th className="py-3 px-6">Restaurant Name</th>
                      <th className="py-3 px-6">Slug</th>
                      <th className="py-3 px-6">Owner Email</th>
                      <th className="py-3 px-6">Plan</th>
                      <th className="py-3 px-6">Status</th>
                      <th className="py-3 px-6">Tables</th>
                      <th className="py-3 px-6">MRR</th>
                      <th className="py-3 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredTenants.map((t) => (
                      <tr key={t.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="py-3.5 px-6 font-semibold text-zinc-900">
                          {t.name}
                        </td>
                        <td className="py-3.5 px-6 font-mono text-zinc-500">{t.slug}</td>
                        <td className="py-3.5 px-6 text-zinc-600">{t.ownerEmail}</td>
                        <td className="py-3.5 px-6">
                          <button
                            onClick={() => setEditingTenant(t)}
                            className="cursor-pointer"
                            title="Click to change plan"
                          >
                            <Badge
                              variant={
                                t.plan === "Enterprise"
                                  ? "teal"
                                  : t.plan === "Pro"
                                  ? "info"
                                  : "neutral"
                              }
                            >
                              {t.plan} ✎
                            </Badge>
                          </button>
                        </td>
                        <td className="py-3.5 px-6">
                          <Badge
                            variant={
                              t.status === "ACTIVE"
                                ? "success"
                                : t.status === "TRIAL"
                                ? "warning"
                                : "danger"
                            }
                          >
                            {t.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-6 font-medium text-zinc-700">
                          {t.tablesCount} tables
                        </td>
                        <td className="py-3.5 px-6 font-semibold text-zinc-900">
                          {formatCurrency(t.monthlyRevenue)}
                        </td>
                        <td className="py-3.5 px-6 text-right space-x-2">
                          <button
                            onClick={() => toggleTenantStatus(t.id)}
                            className={`text-xs font-semibold px-2 py-1 rounded-md transition-colors ${
                              t.status === "ACTIVE"
                                ? "text-amber-700 hover:bg-amber-50"
                                : "text-emerald-700 hover:bg-emerald-50"
                            }`}
                          >
                            {t.status === "ACTIVE" ? "Suspend" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 2: Subscription Plans */}
        {activeTab === "plans" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">Platform Subscription Tiers</h3>
              <p className="text-xs text-zinc-500">Configure quotas and features per tier.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <Card key={plan.id} className="p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-bold text-zinc-900">{plan.name}</h4>
                    <div className="mt-3 text-3xl font-extrabold text-[#0B192C]">
                      {formatCurrency(plan.monthlyPrice)}{" "}
                      <span className="text-xs font-normal text-zinc-500">/ month</span>
                    </div>

                    <div className="mt-5 space-y-2 text-xs text-zinc-600 border-t border-zinc-100 pt-4">
                      <p className="font-semibold text-zinc-800">
                        Max Tables: <span className="text-[#0E8388]">{plan.maxTables}</span>
                      </p>
                      <p className="font-semibold text-zinc-800">
                        Max Staff Accounts: <span className="text-[#0E8388]">{plan.maxStaff}</span>
                      </p>
                    </div>

                    <ul className="mt-4 space-y-2 text-xs text-zinc-600">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-100 text-center">
                    <span className="text-xs font-bold text-[#0E8388]">Active in Production</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Change Plan Modal */}
      {editingTenant && (
        <Modal
          isOpen={true}
          onClose={() => setEditingTenant(null)}
          title={`Update Plan — ${editingTenant.name}`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-zinc-600">
              Select the new subscription tier for <strong>{editingTenant.name}</strong>:
            </p>

            <div className="grid grid-cols-3 gap-3">
              {(["Starter", "Pro", "Enterprise"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => handleUpdatePlan(p)}
                  className={`p-3 rounded-xl border text-center font-bold transition-all ${
                    editingTenant.plan === p
                      ? "border-[#0E8388] bg-teal-50 text-[#0E8388]"
                      : "border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
