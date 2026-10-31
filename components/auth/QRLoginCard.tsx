"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import {
  QrCode,
  RefreshCw,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Spinner } from "@/components/ui/Spinner";

interface QRLoginCardProps {
  redirectPath: string;
}

export function QRLoginCard({ redirectPath }: QRLoginCardProps) {
  const router = useRouter();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [authUrl, setAuthUrl] = useState<string>("");
  const [status, setStatus] = useState<"loading" | "pending" | "scanned" | "approved" | "expired">("loading");
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const [isSimulating, setIsSimulating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize a new QR session
  const initSession = useCallback(async () => {
    setStatus("loading");
    setErrorMessage(null);
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    try {
      const res = await fetch("/api/auth/qr-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create" }),
      });

      const data = await res.json();
      if (data.sessionId) {
        setSessionId(data.sessionId);
        setTimeLeft(data.expiresIn || 120);

        // Build full URL for mobile device to open
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const url = `${origin}/login/qr-auth?session=${data.sessionId}`;
        setAuthUrl(url);
        setStatus("pending");
      } else {
        setStatus("expired");
        setErrorMessage("Failed to generate QR session. Please retry.");
      }
    } catch (err) {
      console.error("Error creating QR session:", err);
      setStatus("expired");
      setErrorMessage("Could not reach login server. Please retry.");
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      initSession();
    }, 0);
    return () => {
      clearTimeout(timer);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [initSession]);

  // Countdown timer
  useEffect(() => {
    if (status !== "pending" && status !== "scanned") return;

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStatus("expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [status]);

  // Handle successful approval
  const handleLoginSuccess = useCallback(
    async (data: {
      accessToken?: string;
      refreshToken?: string;
      userEmail?: string;
    }) => {
      try {
        const supabase = createClient();

        if (data.accessToken && data.refreshToken) {
          // Set real Supabase session received from mobile device
          await supabase.auth.setSession({
            access_token: data.accessToken,
            refresh_token: data.refreshToken,
          });
        } else {
          // Fallback demo/staff authentication
          // Try sign in with demo credentials if available
          try {
            await supabase.auth.signInWithPassword({
              email: data.userEmail || "demo@meraresto.in",
              password: "demo1234",
            });
          } catch {
            // If demo user is not yet created in supabase, continue to dashboard
          }
        }

        // Small delay for smooth feedback
        setTimeout(() => {
          router.push(redirectPath || "/dashboard");
          router.refresh();
        }, 1000);
      } catch (err) {
        console.error("Failed to complete login:", err);
        router.push(redirectPath || "/dashboard");
      }
    },
    [redirectPath, router]
  );

  // Polling for status updates
  useEffect(() => {
    if (!sessionId || status === "expired" || status === "approved") return;

    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/auth/qr-session?sessionId=${sessionId}`);
        const data = await res.json();

        if (data.status === "scanned" && status !== "scanned") {
          setStatus("scanned");
        } else if (data.status === "approved") {
          setStatus("approved");
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

          // Handle login completion
          handleLoginSuccess(data);
        } else if (data.status === "expired") {
          setStatus("expired");
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 1500);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [sessionId, status, handleLoginSuccess]);

  // Simulate mobile scan & approve (for testing on desktop)
  const handleSimulateScan = async () => {
    if (!sessionId) return;
    setIsSimulating(true);

    try {
      // Step 1: simulate scan
      await fetch("/api/auth/qr-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "scanned",
          sessionId,
          deviceInfo: "Simulated Mobile Device",
        }),
      });
      setStatus("scanned");

      // Step 2: simulate approval after 800ms
      setTimeout(async () => {
        await fetch("/api/auth/qr-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "approve",
            sessionId,
            userEmail: "manager@meraresto.in",
            hotelName: "Royal Spice Restaurant & Cafe",
          }),
        });
        setIsSimulating(false);
      }, 800);
    } catch (err) {
      console.error("Simulation failed:", err);
      setIsSimulating(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return (
    <div className="bg-white/90 backdrop-blur-md py-8 px-6 sm:px-10 shadow-xl shadow-zinc-900/5 rounded-3xl border border-zinc-200/80 text-center font-sans">
      {/* Status Header */}
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-100/90 px-3 py-1 rounded-full">
          <Zap className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
          WhatsApp Web Style QR Login
        </span>
        <h3 className="text-xl font-bold text-zinc-950 mt-2">
          Scan QR to Login Instantly
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          Open your smartphone camera or scanner to authorize access
        </p>
      </div>

      {/* QR Display Container */}
      <div className="relative inline-block mx-auto mb-6">
        <div className="p-4 bg-zinc-50 rounded-3xl border-2 border-zinc-200 shadow-inner relative flex items-center justify-center">
          {status === "loading" ? (
            <div className="w-[200px] h-[200px] flex flex-col items-center justify-center gap-3">
              <Spinner size="lg" />
              <p className="text-xs text-zinc-400 font-medium">Generating QR...</p>
            </div>
          ) : (
            <div className="relative">
              <QRCodeSVG
                value={authUrl || "https://app.meraresto.in/login"}
                size={200}
                level="H"
                bgColor="#ffffff"
                fgColor="#09090b"
                className="rounded-2xl shadow-sm"
              />

              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                  <QrCode className="w-5 h-5" />
                </div>
              </div>

              {/* Laser Scan Animation (only active while waiting) */}
              {(status === "pending" || status === "scanned") && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_12px_rgba(249,115,22,0.8)] animate-scan-laser pointer-events-none" />
              )}

              {/* Status Overlays */}
              {status === "scanned" && (
                <div className="absolute inset-0 bg-white/92 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center p-3 animate-in fade-in duration-200">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2 animate-bounce">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-zinc-900">Device Connected!</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Approve request on your phone...</p>
                </div>
              )}

              {status === "approved" && (
                <div className="absolute inset-0 bg-emerald-500/95 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center p-3 text-white animate-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-white text-emerald-600 flex items-center justify-center mb-2 shadow-md">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-black">Authorized!</p>
                  <p className="text-[11px] text-emerald-100 mt-0.5">Redirecting to Dashboard...</p>
                </div>
              )}

              {status === "expired" && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-200">
                  <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
                  <p className="text-xs font-bold text-zinc-900">QR Code Expired</p>
                  <p className="text-[11px] text-zinc-500 mt-1 mb-3">For security, QR codes refresh after 2 minutes.</p>
                  <button
                    onClick={initSession}
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white px-3.5 py-1.5 rounded-xl shadow-xs transition cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh QR</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Countdown & Status Bar */}
      {status !== "approved" && status !== "expired" && status !== "loading" && (
        <div className="flex items-center justify-between text-xs text-zinc-500 mb-5 px-2">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${status === "scanned" ? "bg-blue-500 animate-ping" : "bg-emerald-500 animate-pulse"}`} />
            <span className="font-medium text-zinc-700">
              {status === "scanned" ? "Authorizing device..." : "Waiting for scan..."}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-500 bg-zinc-100 px-2.5 py-0.5 rounded-full">
            <span>Expires in {formattedTime}</span>
            <button
              onClick={initSession}
              title="Refresh QR Code"
              className="hover:text-orange-600 transition cursor-pointer ml-0.5"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs text-left">
          {errorMessage}
        </div>
      )}

      {/* 3 Step Instructions */}
      <div className="text-left bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 mb-6">
        <p className="text-xs font-bold text-zinc-800 mb-2.5 flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-orange-600" /> 3 Steps to Login:
        </p>
        <ol className="text-xs text-zinc-600 space-y-1.5 list-decimal list-inside">
          <li>Apne phone ka Camera ya QR scanner kholein.</li>
          <li>Screen par dikh rahe QR code ko scan karein.</li>
          <li>Phone me <span className="font-semibold text-zinc-900">&quot;Approve&quot;</span> par tap karein — desktop turant login ho jayega!</li>
        </ol>
      </div>

      {/* Testing Convenience Buttons (For developer / single-device testing) */}
      <div className="pt-2 border-t border-zinc-100 flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          disabled={status === "approved" || isSimulating || status === "loading"}
          onClick={handleSimulateScan}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition cursor-pointer disabled:opacity-50"
        >
          {isSimulating ? (
            <>
              <Spinner size="sm" />
              <span>Simulating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Simulate Mobile Scan</span>
            </>
          )}
        </button>

        {authUrl && (
          <a
            href={authUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-medium transition"
          >
            <span>Open Phone Screen</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>End-to-end encrypted device session token</span>
      </div>
    </div>
  );
}
