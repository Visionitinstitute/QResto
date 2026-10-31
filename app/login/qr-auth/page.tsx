"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  UtensilsCrossed,
  ShieldCheck,
  Laptop,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Spinner } from "@/components/ui/Spinner";

function QRAuthContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "ready" | "approving" | "approved" | "rejected" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [hotelName, setHotelName] = useState<string>("Royal Spice Restaurant");

  useEffect(() => {
    if (!sessionId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("error");
      setErrorMessage("Invalid QR Code session. Please scan a fresh QR code from your desktop.");
      return;
    }

    async function initScan() {
      try {
        // Check if phone already has a supabase session
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setCurrentUserEmail(user.email);
          const { data: hotelData } = await supabase
            .from("hotels")
            .select("name")
            .eq("owner_id", user.id)
            .maybeSingle();
          if (hotelData?.name) {
            setHotelName(hotelData.name);
          }
        }

        // Notify server that QR was scanned
        await fetch("/api/auth/qr-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "scanned",
            sessionId,
            deviceInfo: "Mobile Phone Browser",
          }),
        });

        setStatus("ready");
      } catch (err) {
        console.error("Failed to register scan:", err);
        setStatus("ready");
      }
    }

    initScan();
  }, [sessionId]);

  const handleApprove = async () => {
    if (!sessionId) return;
    setStatus("approving");

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch("/api/auth/qr-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve",
          sessionId,
          userEmail: currentUserEmail || "manager@meraresto.in",
          hotelName: hotelName,
          accessToken: session?.access_token,
          refreshToken: session?.refresh_token,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setStatus("approved");
      } else {
        setStatus("error");
        setErrorMessage(result.error || "Failed to approve login.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error while approving login. Please try again.");
    }
  };

  const handleReject = () => {
    setStatus("rejected");
  };

  return (
    <div className="max-w-md w-full bg-white rounded-3xl border border-zinc-200/90 shadow-xl p-6 sm:p-8 text-center font-sans">
      {/* Brand Header */}
      <div className="flex justify-center mb-5">
        <div className="w-12 h-12 rounded-2xl bg-[#0B192C] flex items-center justify-center text-white shadow-md shadow-zinc-900/20">
          <UtensilsCrossed className="w-6 h-6 text-[#0E8388]" />
        </div>
      </div>

      <h1 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
        Portal Login Request
      </h1>
      <p className="text-xs sm:text-sm text-zinc-500 mt-1">
        A desktop browser is requesting access to MeraResto Portal
      </p>

      {/* State: Loading */}
      {status === "loading" && (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <Spinner size="lg" />
          <p className="text-xs text-zinc-500 font-medium">Verifying QR Session...</p>
        </div>
      )}

      {/* State: Ready for Approval */}
      {(status === "ready" || status === "approving") && (
        <div className="mt-6 space-y-5 text-left">
          {/* Device Info Card */}
          <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <Laptop className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-900">Desktop Web Browser</p>
                <p className="text-[11px] text-zinc-500">Connected via Local Session</p>
              </div>
            </div>

            <div className="border-t border-zinc-200/60 pt-2.5 text-xs text-zinc-600 space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-500">Restaurant:</span>
                <span className="font-semibold text-zinc-900">{hotelName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Account:</span>
                <span className="font-semibold text-zinc-900">
                  {currentUserEmail || "demo@meraresto.in (Staff)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Security:</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> End-to-end QR Pairing
                </span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200/70 rounded-xl p-3 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-900 leading-relaxed">
              Kripya confirm karein ki yeh request aapki screen par dikh rahi hai. Approve karne par desktop par dashboard khul jayega.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleApprove}
              disabled={status === "approving"}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              {status === "approving" ? (
                <>
                  <Spinner size="sm" />
                  <span>Approving Login...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Log In Desktop</span>
                </>
              )}
            </button>

            <button
              onClick={handleReject}
              disabled={status === "approving"}
              className="w-full py-2.5 px-4 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-semibold text-xs transition cursor-pointer"
            >
              Cancel / Reject
            </button>
          </div>
        </div>
      )}

      {/* State: Approved */}
      {status === "approved" && (
        <div className="py-8 space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black text-zinc-900">Login Approved!</h2>
          <p className="text-xs text-zinc-600 max-w-xs mx-auto">
            Aapka desktop browser ab dashboard me authenticate ho chuka hai. Aap is phone window ko band kar sakte hain.
          </p>
          <div className="pt-4">
            <button
              onClick={() => router.push("/")}
              className="text-xs text-orange-600 font-bold hover:underline"
            >
              Home par wapas jayein
            </button>
          </div>
        </div>
      )}

      {/* State: Rejected */}
      {status === "rejected" && (
        <div className="py-8 space-y-3">
          <div className="w-14 h-14 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black text-zinc-900">Login Rejected</h2>
          <p className="text-xs text-zinc-500">
            Aapne is login request ko cancel kar diya hai. Desktop login nahi hua.
          </p>
        </div>
      )}

      {/* State: Error */}
      {status === "error" && (
        <div className="py-8 space-y-3">
          <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black text-zinc-900">Session Error</h2>
          <p className="text-xs text-red-600 max-w-xs mx-auto">
            {errorMessage || "QR Code session expire ho chuka hai. Kripya desktop par QR refresh karein."}
          </p>
        </div>
      )}
    </div>
  );
}

export default function QRAuthPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50/70 via-white to-zinc-50 flex items-center justify-center p-4">
      <Suspense fallback={<Spinner size="lg" />}>
        <QRAuthContent />
      </Suspense>
    </div>
  );
}
