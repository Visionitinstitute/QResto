"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  Activity,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from "@meraresto/ui";
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
];

export default function SuperAdminDashboard() {
  const [tenants, setTenants] = useState<TenantRecord[]>(INITIAL_TENANTS);
  const [search, setSearch] = useState("");

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase()) ||
      t.ownerEmail.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Total Restaurants", value: "148", change: "+12 this month", icon: Building2, color: "text-[#0E8388] bg-teal-50" },
    { label: "Monthly Recurring Revenue", value: formatCurrency(124800), change: "+18.4% MRR", icon: CreditCard, color: "text-emerald-600 bg-emerald-50" },
    { label: "Total Orders Processed", value: "64,210", change: "Across all tenants", icon: Activity, color: "text-blue-600 bg-blue-50" },
    { label: "System Health", value: "99.98%", change: "Supabase & Vercel OK", icon: ShieldCheck, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#0B192C]">
      {/* Top Super Admin Bar */}
      <header className="border-b border-zinc-200/80 bg-white px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0B192C] text-white">
            <ShieldCheck className="h-5 w-5 text-[#0E8388]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#0B192C] leading-none">
              Mera<span className="text-[#0E8388]">Resto</span> Super Admin
            </h1>
            <span className="text-xs text-zinc-500 font-medium">
              Multi-Tenant Cloud Operations
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-zinc-600">
          <span className="flex items-center gap-1.5 text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            All Clusters Operational
          </span>
          <div className="h-4 w-px bg-zinc-200" />
          <span className="text-zinc-800">admin@meraresto.in</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8 space-y-8">
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

        {/* Tenant Directory Card */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold text-zinc-900">
                Restaurant Tenants Directory
              </CardTitle>
              <p className="text-xs text-zinc-500 mt-0.5">
                Manage registered restaurant organizations, subscriptions, and quotas.
              </p>
            </div>

            <div className="w-full sm:w-72 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search tenant or email..."
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
                    <th className="py-3 px-6">Joined</th>
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
                        <Badge
                          variant={
                            t.plan === "Enterprise"
                              ? "teal"
                              : t.plan === "Pro"
                              ? "info"
                              : "neutral"
                          }
                        >
                          {t.plan}
                        </Badge>
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
                      <td className="py-3.5 px-6 text-zinc-400">{t.joinedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
