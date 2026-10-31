import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createAdminClient } from "@meraresto/database";

export async function GET() {
  try {
    const adminSupabase = createAdminClient();
    const { data: restaurants, error } = await adminSupabase
      .from("restaurants")
      .select("*, subscriptions(*), dining_tables(count)")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, restaurants });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { error: error?.message || "Failed to fetch platform tenants." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenantId, isActive, planId } = body;

    if (!tenantId) {
      return NextResponse.json({ error: "tenantId is required." }, { status: 400 });
    }

    const adminSupabase = createAdminClient();

    if (typeof isActive === "boolean") {
      const { error: updateErr } = await adminSupabase
        .from("restaurants")
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq("id", tenantId);

      if (updateErr) {
        return NextResponse.json({ error: updateErr.message }, { status: 500 });
      }
    }

    if (planId) {
      await adminSupabase
        .from("subscriptions")
        .update({ plan_id: planId, updated_at: new Date().toISOString() })
        .eq("restaurant_id", tenantId);
    }

    return NextResponse.json({ success: true, tenantId });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { error: error?.message || "Failed to update tenant." },
      { status: 500 }
    );
  }
}

