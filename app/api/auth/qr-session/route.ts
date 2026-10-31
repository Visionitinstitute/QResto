import { NextResponse } from "next/server";

interface QRSession {
  sessionId: string;
  status: "pending" | "scanned" | "approved" | "expired";
  createdAt: number;
  userEmail?: string;
  hotelName?: string;
  deviceInfo?: string;
  accessToken?: string;
  refreshToken?: string;
}

// In-memory session registry (persists across requests during server runtime)
const qrSessions = new Map<string, QRSession>();

// Auto-purge sessions older than 5 minutes
function purgeStaleSessions() {
  const now = Date.now();
  for (const [id, session] of qrSessions.entries()) {
    if (now - session.createdAt > 5 * 60 * 1000) {
      qrSessions.delete(id);
    }
  }
}

// GET: Check status of a QR login session
export async function GET(request: Request) {
  purgeStaleSessions();
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json(
      { error: "sessionId parameter is required" },
      { status: 400 }
    );
  }

  const session = qrSessions.get(sessionId);
  if (!session) {
    return NextResponse.json({
      status: "expired",
      message: "Session expired or not found. Please refresh QR code.",
    });
  }

  // Check if session timed out (2 minutes limit)
  if (Date.now() - session.createdAt > 2 * 60 * 1000) {
    session.status = "expired";
    return NextResponse.json({
      status: "expired",
      message: "QR code has expired. Please refresh to generate a new one.",
    });
  }

  return NextResponse.json({
    status: session.status,
    userEmail: session.userEmail,
    hotelName: session.hotelName,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    expiresIn: Math.max(0, Math.floor((120000 - (Date.now() - session.createdAt)) / 1000)),
  });
}

// POST: Register, scan, or approve a QR session
export async function POST(request: Request) {
  purgeStaleSessions();

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    // If body is empty or plain text
    try {
      const text = await request.text();
      body = JSON.parse(text) as Record<string, unknown>;
    } catch {
      body = {};
    }
  }

  try {
    const action = body.action as string | undefined;
    const sessionId = body.sessionId as string | undefined;
    const userEmail = body.userEmail as string | undefined;
    const hotelName = body.hotelName as string | undefined;
    const deviceInfo = body.deviceInfo as string | undefined;
    const accessToken = body.accessToken as string | undefined;
    const refreshToken = body.refreshToken as string | undefined;

    // Action 1: Create a new QR session
    if (action === "create") {
      const newSessionId = `qr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const newSession: QRSession = {
        sessionId: newSessionId,
        status: "pending",
        createdAt: Date.now(),
      };
      qrSessions.set(newSessionId, newSession);

      return NextResponse.json({
        success: true,
        sessionId: newSessionId,
        expiresIn: 120, // 2 minutes
      });
    }

    // Existing session validation for other actions
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    const session = qrSessions.get(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session expired or invalid" }, { status: 404 });
    }

    // Action 2: Mobile device scanned the QR code
    if (action === "scanned") {
      session.status = "scanned";
      session.deviceInfo = deviceInfo || "Mobile Device";
      return NextResponse.json({ success: true, status: "scanned" });
    }

    // Action 3: Approve login from mobile device or simulated test
    if (action === "approve") {
      session.status = "approved";
      session.userEmail = userEmail || "manager@meraresto.in";
      session.hotelName = hotelName || "Royal Spice Restaurant & Cafe";
      session.accessToken = accessToken;
      session.refreshToken = refreshToken;

      return NextResponse.json({
        success: true,
        status: "approved",
        userEmail: session.userEmail,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("QR session error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
