"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UtensilsCrossed, Lock, Mail, ArrowRight } from "lucide-react";
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from "@meraresto/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // In Phase 4 this connects to @meraresto/auth Supabase Auth
    setTimeout(() => {
      window.location.href = "/";
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#fafaf9]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B192C] text-white shadow-md mb-3">
            <UtensilsCrossed className="h-6 w-6 text-[#0E8388]" />
          </div>
          <h1 className="text-2xl font-bold text-[#0B192C]">
            Sign in to Mera<span className="text-[#0E8388]">Resto</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Access your restaurant manager portal
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="manager@restaurant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                className="w-full bg-[#0B192C] hover:bg-zinc-800 text-white"
                isLoading={loading}
              >
                Sign In
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-zinc-500">
              Don&apos;t have a MeraResto account?{" "}
              <Link href="/signup" className="font-semibold text-[#0E8388] hover:underline">
                Start Free Trial
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
