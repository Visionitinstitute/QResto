"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UtensilsCrossed, ArrowRight } from "lucide-react";
import { Button, Input, Card, CardContent } from "@meraresto/ui";

export default function SignUpPage() {
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Phase 4: Supabase registration & tenant bootstrapping
    setTimeout(() => {
      window.location.href = "/";
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#fafaf9]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B192C] text-white shadow-md mb-3">
            <UtensilsCrossed className="h-6 w-6 text-[#0E8388]" />
          </div>
          <h1 className="text-2xl font-bold text-[#0B192C]">
            Register Your Restaurant
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Get instant QR codes, digital menus, and KDS
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Restaurant Name"
                placeholder="e.g. Balkumari Fine Dine"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                required
              />

              <Input
                label="Owner / Manager Email"
                type="email"
                placeholder="owner@restaurant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Contact Phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <Input
                label="Create Password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                className="w-full bg-[#0B192C] hover:bg-zinc-800 text-white"
                isLoading={loading}
              >
                Create Restaurant Account
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-zinc-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#0E8388] hover:underline">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

