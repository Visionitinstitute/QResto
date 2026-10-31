"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UtensilsCrossed,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!fullName || !email || !password) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      // If Supabase session is created immediately (email confirmation disabled in dev)
      if (data.session) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setSuccessMessage(
          "Account created successfully! Please check your email for a confirmation link, then sign in."
        );
        setIsLoading(false);
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "An error occurred during sign up. Please try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-emerald-50/40 via-white to-zinc-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="w-11 h-11 rounded-2xl bg-[#0B192C] flex items-center justify-center text-white shadow-md shadow-zinc-900/10 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5 text-[#39ff14]" />
          </div>
          <span className="text-2xl font-black tracking-tight text-[#0B192C]">
            Mera<span className="text-emerald-600">Resto</span>
          </span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
          Register Your Restaurant
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          Start your digital QR menu and table ordering in 2 minutes
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white/90 backdrop-blur-md py-8 px-6 sm:px-10 shadow-xl shadow-zinc-900/5 rounded-3xl border border-zinc-200/80">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-red-700 font-medium leading-relaxed">
                {errorMessage}
              </p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm text-emerald-800 font-medium leading-relaxed">
                  {successMessage}
                </p>
                <Link
                  href="/login"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900"
                >
                  Sign In Now <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {!successMessage && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5"
                >
                  Full Name / Manager Name
                </label>
                <div className="relative">
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Rahul Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="manager@restaurant.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5"
                >
                  Password (minimum 6 characters)
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-1.5"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-3 bg-[#0B192C] hover:bg-black text-[#39ff14] border border-[#39ff14]/40 font-bold shadow-md shadow-[#39ff14]/15"
                isLoading={isLoading}
              >
                Create Account <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
            <p className="text-xs sm:text-sm text-zinc-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-emerald-700 hover:text-emerald-800 transition"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
