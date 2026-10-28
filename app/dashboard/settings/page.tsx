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
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { createClient } from "@/lib/supabase/client";
import { Hotel } from "@/types";

export default function DashboardSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hotel, setHotel] = useState<Hotel | null>(null);

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
          text: "Hotel settings safaltapoorvak save ho gayi hain!",
        });
      }
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Settings save nahi ho saki.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-zinc-500">Settings load ho rahi hain...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-zinc-200">
        <Store className="w-10 h-10 text-orange-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-zinc-900">Pehle apna hotel set up karein</h2>
        <p className="text-sm text-zinc-500 mt-1 mb-4">
          Aapne abhi tak koi hotel add nahi kiya hai.
        </p>
        <Link href="/dashboard">
          <Button>Overview par jayein</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          Hotel Settings
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Apne restaurant ki profile, contact number, pata aur branding manage karein.
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

      <Card className="p-6 sm:p-8">
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
                Slug ko badla nahi ja sakta kyonki isse aapke table QR codes jude hain.
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
                Address
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
                  className="w-4 h-4 text-orange-600 rounded border-zinc-300 focus:ring-orange-500"
                />
                <div>
                  <span className="text-sm font-semibold text-zinc-900">
                    Hotel & Digital Menu Ko Live Rakhein
                  </span>
                  <p className="text-xs text-zinc-500">
                    Agar band karenge to customer QR scan karne par menu nahi dekh payenge.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex justify-end">
            <Button type="submit" variant="primary" isLoading={saving}>
              <Save className="w-4 h-4 mr-1.5" /> Changes Save Karein
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
