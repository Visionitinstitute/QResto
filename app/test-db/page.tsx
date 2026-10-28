import Link from "next/link";
import { Database, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function TestDbPage() {
  let connectionSuccess = false;
  let errorMessage: string | null = null;
  let hotels: Array<{ id: string; name: string; slug: string; is_active: boolean }> = [];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasKeys =
    Boolean(supabaseUrl) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
    supabaseUrl !== "https://your-project.supabase.co";

  if (hasKeys) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("hotels")
        .select("id, name, slug, is_active")
        .limit(5);

      if (error) {
        errorMessage = error.message;
      } else {
        connectionSuccess = true;
        hotels = data || [];
      }
    } catch (err: unknown) {
      errorMessage = err instanceof Error ? err.message : "Unknown connection error";
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">
              Supabase Connection Test
            </h1>
            <p className="text-sm text-zinc-500">
              Phase 2.1 – Connection Verification
            </p>
          </div>
        </div>

        {/* State Banner */}
        {!hasKeys ? (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-amber-900">
                  Supabase Credentials Missing
                </h3>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  Please create a <code>.env.local</code> file in the <code>qresto/</code> folder with your real keys:
                </p>
                <pre className="mt-2 text-xs bg-amber-100/80 p-2.5 rounded-lg text-amber-900 font-mono overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key`}
                </pre>
              </div>
            </div>
          </div>
        ) : connectionSuccess ? (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-emerald-900">
                  Connection Successful!
                </h3>
                <p className="text-xs text-emerald-700 mt-1">
                  Supabase client connected properly. Found {hotels.length} hotel(s) in the database.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-red-900">
                  Connection Failed or Tables Not Created
                </h3>
                <p className="text-xs text-red-700 mt-1 font-mono break-all">
                  Error: {errorMessage}
                </p>
                <p className="text-xs text-red-600 mt-2">
                  Have you run <code>supabase/schema.sql</code> in your Supabase SQL editor?
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hotels Data List */}
        {hotels.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-zinc-800 mb-2">
              Hotels Data in Supabase:
            </h2>
            <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-xl overflow-hidden">
              {hotels.map((hotel) => (
                <div key={hotel.id} className="p-3 text-xs flex justify-between items-center bg-zinc-50/50">
                  <div>
                    <span className="font-medium text-zinc-900">{hotel.name}</span>
                    <span className="text-zinc-400 ml-2">({hotel.slug})</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
