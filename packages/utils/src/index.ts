import type { OrderStatus } from "@meraresto/types";

/**
 * Merges class names cleanly (simple drop-in without extra bloat)
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
    .replace(/\s+/g, "-")        // Replace spaces with -
    .replace(/&/g, "-and-")      // Replace & with 'and'
    .replace(/[^\w\-]+/g, "")    // Remove all non-word chars
    .replace(/\-\-+/g, "-")      // Replace multiple - with single -
    .replace(/^-+/, "")          // Trim - from start of text
    .replace(/-+$/, "");         // Trim - from end of text
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
    return "";
  }
}

/**
 * Formats a date string into readable date (e.g. 30 Oct 2026)
 */
export function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

/**
 * Validates if an order status transition is permissible
 */
export function isValidOrderStatusTransition(
  current: OrderStatus,
  next: OrderStatus
): boolean {
  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    pending: ["accepted", "rejected"],
    accepted: ["preparing", "rejected"],
    preparing: ["ready"],
    ready: ["served"],
    served: ["completed"],
    completed: [],
    rejected: [],
  };

  return allowedTransitions[current]?.includes(next) ?? false;
}
