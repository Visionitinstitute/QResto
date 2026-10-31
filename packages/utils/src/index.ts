import type { OrderStatus } from "@meraresto/types";

/**
 * Merges class names cleanly
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Formats a monetary amount into a localized currency string
 * e.g. 499 => ₹499
 */
export function formatCurrency(
  amount: number,
  symbol = "₹"
): string {
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);

  return `${symbol}${formatted}`;
}

/**
 * Converts a text string into a URL-safe, SEO-friendly slug
 * e.g. "Balkumari Restaurant & Cafe" => "balkumari-restaurant-cafe"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

/**
 * Formats a date string into readable time (e.g. 02:45 PM)
 */
export function formatTime(dateString: string): string {
  try {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

/**
 * Formats a date string into relative time (e.g. "5m ago", "Just now")
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return dateString;
  }
}

/**
 * Subscription Plan quotas & capabilities
 */
export const PLAN_QUOTAS = {
  starter: {
    name: "Starter Free",
    monthlyPrice: 0,
    maxTables: 10,
    maxStaff: 2,
    maxMenuItems: 30,
    kdsEnabled: false,
    customDomain: false,
  },
  pro: {
    name: "Pro Resto",
    monthlyPrice: 999,
    maxTables: 50,
    maxStaff: 10,
    maxMenuItems: 200,
    kdsEnabled: true,
    customDomain: false,
  },
  enterprise: {
    name: "Enterprise",
    monthlyPrice: 2499,
    maxTables: 200,
    maxStaff: 50,
    maxMenuItems: 1000,
    kdsEnabled: true,
    customDomain: true,
  },
} as const;

export type PlanTier = keyof typeof PLAN_QUOTAS;

/**
 * Validates if an action is within subscription plan quota
 */
export function isWithinPlanQuota(
  plan: PlanTier,
  metric: "tables" | "staff" | "items",
  currentCount: number
): boolean {
  const quota = PLAN_QUOTAS[plan];
  if (!quota) return false;

  if (metric === "tables") return currentCount < quota.maxTables;
  if (metric === "staff") return currentCount < quota.maxStaff;
  if (metric === "items") return currentCount < quota.maxMenuItems;
  return true;
}

/**
 * Validates if an order status transition is permissible
 */
export function isValidOrderStatusTransition(
  current: OrderStatus,
  next: OrderStatus
): boolean {
  const c = current.toLowerCase();
  const n = next.toLowerCase();

  const allowedTransitions: Record<string, string[]> = {
    pending: ["accepted", "rejected", "cancelled", "preparing"],
    accepted: ["preparing", "rejected", "cancelled"],
    preparing: ["ready", "cancelled"],
    ready: ["served", "completed"],
    served: ["completed"],
    completed: [],
    rejected: [],
    cancelled: [],
  };

  return allowedTransitions[c]?.includes(n) ?? false;
}
