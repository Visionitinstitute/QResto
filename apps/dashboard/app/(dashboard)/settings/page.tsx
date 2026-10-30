"use client";

import React, { useState } from "react";
import {
  Building2,
  Save,
  CheckCircle2,
  FileText,
  DollarSign,
  BellRing,
  ShieldCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from "@meraresto/ui";

export default function RestaurantSettingsPage() {
  const [restaurantName, setRestaurantName] = useState("Balkumari Restaurant & Cafe");
  const [slug, setSlug] = useState("balkumari");
  const [tagline, setTagline] = useState("Authentic Multi-Cuisine Fine Dining");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [email, setEmail] = useState("manager@balkumari.com");
  const [address, setAddress] = useState("Main Road, Near City Mall, Lalitpur");
  const [gstin, setGstin] = useState("07AAAAA0000A1Z5");
  const [fssai, setFssai] = useState("10019011000123");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/80">
        <div>
          <h2 className="text-xl font-bold text-[#0B192C]">Restaurant Settings</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage your restaurant profile, contact details, tax compliance, and preferences.
          </p>
        </div>

        {saved && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg animate-fade-in">
            <CheckCircle2 className="h-4 w-4" />
            Changes Saved Successfully!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#0E8388]" />
              General Restaurant Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Restaurant Name"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                required
              />

              <Input
                label="Unique Menu Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                helperText="Used in customer QR codes: menu.meraresto.in/balkumari"
                required
              />
            </div>

            <Input
              label="Tagline / Short Slogan"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Official Contact Phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <Input
                label="Official Contact Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 mb-1 block">
                Physical Address
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs text-zinc-800 focus:outline-hidden focus:border-[#0E8388]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Legal & Taxation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#0E8388]" />
              Taxation & Compliance (India)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="GSTIN (Goods & Services Tax)"
                placeholder="15-digit GSTIN"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
              />

              <Input
                label="FSSAI Food License Number"
                placeholder="14-digit FSSAI License"
                value={fssai}
                onChange={(e) => setFssai(e.target.value)}
              />
            </div>

            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 text-xs text-zinc-600">
              Tax is automatically calculated at standard 5% GST on dining orders unless configured otherwise.
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-[#0B192C] hover:bg-zinc-800 text-white px-6 py-2.5 text-xs font-semibold"
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Restaurant Profile
          </Button>
        </div>
      </form>
    </div>
  );
}

