"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UtensilsCrossed, QrCode, ArrowRight } from "lucide-react";
import { Button, Input, Card, CardContent } from "@meraresto/ui";

export default function GuestLandingPage() {
  const router = useRouter();
  const [restaurantSlug, setRestaurantSlug] = useState("balkumari");
  const [tableNumber, setTableNumber] = useState("1");

  const handleOpenMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (restaurantSlug.trim()) {
      router.push(`/${restaurantSlug.trim()}?table=${tableNumber || 1}`);
    }
  };

  return (
    <div className="p-6 pt-12 flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B192C] text-white shadow-lg mb-4">
        <UtensilsCrossed className="h-7 w-7 text-[#0E8388]" />
      </div>

      <h1 className="text-xl font-bold text-[#0B192C]">
        Mera<span className="text-[#0E8388]">Resto</span> Digital Menu
      </h1>
      <p className="text-xs text-zinc-500 mt-1 mb-8 max-w-xs">
        Scan your dining table QR code or choose your restaurant below to view the live menu.
      </p>

      <Card className="w-full text-left">
        <CardContent className="p-5">
          <form onSubmit={handleOpenMenu} className="space-y-4">
            <Input
              label="Restaurant Identifier (Slug)"
              placeholder="e.g. balkumari"
              value={restaurantSlug}
              onChange={(e) => setRestaurantSlug(e.target.value)}
              required
            />

            <Input
              label="Table Number"
              placeholder="e.g. 4"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />

            <Button type="submit" className="w-full bg-[#0B192C] hover:bg-zinc-800 text-white">
              <QrCode className="h-4 w-4 mr-2" />
              Open Live Menu
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
