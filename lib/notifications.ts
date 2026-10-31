/**
 * In-Browser Web Notification & Realtime Audio Chime System
 * Designed for MeraResto Table Dining (Zero WhatsApp/SMS Cost)
 */

type ChimeType = "ding" | "bell" | "kitchen" | "served";

/**
 * Synthesizes a clean, pleasant hospitality chime using Web Audio API.
 * Requires no external audio files, completely zero network latency.
 */
export function playChimeSound(type: ChimeType = "bell"): void {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      // @ts-expect-error Safari webkit prefix fallback
      window.webkitAudioContext;

    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    if (type === "kitchen" || type === "ding") {
      // Warm double-ping: E5 (659Hz) -> A5 (880Hz)
      playTone(ctx, 659.25, now, 0.18, 0.2);
      playTone(ctx, 880.0, now + 0.12, 0.35, 0.25);
    } else if (type === "served") {
      // Pleasant triad chime: C5 (523Hz) -> E5 (659Hz) -> G5 (784Hz)
      playTone(ctx, 523.25, now, 0.2, 0.15);
      playTone(ctx, 659.25, now + 0.1, 0.2, 0.15);
      playTone(ctx, 783.99, now + 0.2, 0.45, 0.25);
    } else {
      // Standard service bell chime: F#5 (739Hz) -> C#6 (1108Hz)
      playTone(ctx, 739.99, now, 0.15, 0.18);
      playTone(ctx, 1108.73, now + 0.1, 0.4, 0.22);
    }
  } catch {
    // AudioContext blocked by autoplay policy or browser restriction
  }
}

function playTone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  peakGain: number
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(0.001, startTime);
  gain.gain.exponentialRampToValueAtTime(peakGain, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

/**
 * Requests browser permission for native Web Push / notifications.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission === "denied") {
    return false;
  }

  try {
    const result = await Notification.requestPermission();
    return result === "granted";
  } catch {
    return false;
  }
}

/**
 * Checks current notification permission status.
 */
export function getNotificationPermissionStatus(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

/**
 * Sends a native browser web notification and plays an audio chime.
 */
export function notifyDiner(
  title: string,
  body: string,
  type: ChimeType = "bell"
): void {
  // 1. Play audio chime
  playChimeSound(type);

  // 2. Dispatch in-app custom event for floating toast
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("meraresto_table_notification", {
        detail: { title, body, type, timestamp: new Date().toISOString() },
      })
    );
  }

  // 3. Trigger native browser notification if granted
  if (
    typeof window !== "undefined" &&
    "Notification" in window &&
    Notification.permission === "granted"
  ) {
    try {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        silent: true, // We already play our high-fidelity chime above
      });
    } catch {
      // Fallback if background worker required
    }
  }
}

