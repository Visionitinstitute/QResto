import { SupabaseClient, User } from "@supabase/supabase-js";

export type SubscriptionPlanId = "starter" | "pro" | "enterprise";
export type BillingInterval = "monthly" | "yearly";
export type SubscriptionStatus = "active" | "trialing" | "past_due" | "cancelled" | "unpaid";

export interface PlanQuotaDetails {
  id: SubscriptionPlanId;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number; // monthly equivalent when paid annually
  annualBilledAmount: number; // total for the year
  badge?: string;
  popular?: boolean;
  maxTables: number;
  maxMenuItems: number;
  maxStaff: number;
  kdsEnabled: boolean;
  soundAlerts: boolean;
  customDomain: boolean;
  analyticsLevel: "basic" | "advanced" | "enterprise";
  support: string;
  features: string[];
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlanId, PlanQuotaDetails> = {
  starter: {
    id: "starter",
    name: "Starter Resto",
    tagline: "Essential digital QR ordering for small cafes & bistros",
    monthlyPrice: 399,
    yearlyPrice: 299,
    annualBilledAmount: 3588,
    badge: "Basic",
    maxTables: 10,
    maxMenuItems: 30,
    maxStaff: 2,
    kdsEnabled: false,
    soundAlerts: false,
    customDomain: false,
    analyticsLevel: "basic",
    support: "Email & Community Support",
    features: [
      "Up to 10 Dining Tables & QR Codes",
      "Up to 30 Menu Items & Categories",
      "Mobile Guest Web Menu (No app required)",
      "Instant Price & Availability Sync",
      "Basic Sales & Orders History",
      "Email Support",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro Resto",
    tagline: "Complete powerhouse for high-volume dining & restaurants",
    monthlyPrice: 699,
    yearlyPrice: 499,
    annualBilledAmount: 5988,
    badge: "Most Popular",
    popular: true,
    maxTables: 50,
    maxMenuItems: 200,
    maxStaff: 10,
    kdsEnabled: true,
    soundAlerts: true,
    customDomain: false,
    analyticsLevel: "advanced",
    support: "24/7 Priority WhatsApp & Phone",
    features: [
      "Up to 50 Dining Tables & Patio Seating",
      "Up to 200 Menu Items & Addons",
      "Live Kitchen Display System (KDS)",
      "Instant Audio Chimes for New Orders",
      "Staff & Waiter PIN Logins",
      "Advanced Sales Analytics & Top Dishes",
      "Priority WhatsApp & Phone Support",
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise Elite",
    tagline: "Full-scale multi-station control for chains & fine dining",
    monthlyPrice: 1299,
    yearlyPrice: 999,
    annualBilledAmount: 11988,
    badge: "Chains & Fine Dining",
    maxTables: 200,
    maxMenuItems: 1000,
    maxStaff: 50,
    kdsEnabled: true,
    soundAlerts: true,
    customDomain: true,
    analyticsLevel: "enterprise",
    support: "Dedicated Hospitality Account Manager",
    features: [
      "Up to 200 Tables (Multi-Floor Support)",
      "Up to 1,000 Menu Items & Variants",
      "Multi-Station Kitchen Display System (KDS)",
      "Custom Domain & Restaurant White-labeling",
      "Unlimited Staff Logins & RBAC Roles",
      "POS & Thermal Printer Integration",
      "Dedicated 24/7 VIP Account Manager",
    ],
  },
};

export interface UserSubscription {
  planId: SubscriptionPlanId;
  status: SubscriptionStatus;
  billing: BillingInterval;
  paidAt: string;
  expiresAt: string;
  amountPaid: number;
  transactionId: string;
  paymentMethod: string;
  plan: PlanQuotaDetails;
}

const STORAGE_KEY = "meraresto_user_subscription";

/**
 * Parses user subscription from Supabase user_metadata or localStorage
 */
export function getStoredSubscription(user?: User | null, hotelId?: string): UserSubscription | null {
  // 1. Try Supabase user metadata
  if (user?.user_metadata?.subscription) {
    const sub = user.user_metadata.subscription;
    const planId: SubscriptionPlanId = (sub.planId as SubscriptionPlanId) || "starter";
    const plan = SUBSCRIPTION_PLANS[planId] || SUBSCRIPTION_PLANS.starter;
    return {
      planId,
      status: sub.status || "active",
      billing: sub.billing || "monthly",
      paidAt: sub.paidAt || new Date().toISOString(),
      expiresAt: sub.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      amountPaid: sub.amountPaid || plan.monthlyPrice,
      transactionId: sub.transactionId || `PAY-${Date.now().toString().slice(-6)}`,
      paymentMethod: sub.paymentMethod || "UPI / Razorpay",
      plan,
    };
  }

  // 2. Fallback to localStorage (client-side)
  if (typeof window !== "undefined") {
    try {
      const key = hotelId ? `${STORAGE_KEY}_${hotelId}` : STORAGE_KEY;
      const raw = localStorage.getItem(key) || localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const planId: SubscriptionPlanId = (parsed.planId as SubscriptionPlanId) || "starter";
        const plan = SUBSCRIPTION_PLANS[planId] || SUBSCRIPTION_PLANS.starter;
        return {
          ...parsed,
          plan,
        };
      }
    } catch {
      // LocalStorage error fallback
    }
  }

  return null;
}

/**
 * Saves subscription to Supabase user metadata and localStorage
 */
export async function saveUserSubscription(
  supabase: SupabaseClient,
  subscriptionData: {
    planId: SubscriptionPlanId;
    billing: BillingInterval;
    amountPaid: number;
    paymentMethod: string;
    transactionId?: string;
    hotelId?: string;
  }
): Promise<UserSubscription> {
  const plan = SUBSCRIPTION_PLANS[subscriptionData.planId] || SUBSCRIPTION_PLANS.starter;
  const now = new Date();
  const expires = new Date(now);
  if (subscriptionData.billing === "yearly") {
    expires.setFullYear(expires.getFullYear() + 1);
  } else {
    expires.setDate(expires.getDate() + 30);
  }

  const transactionId =
    subscriptionData.transactionId ||
    `TXN-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;

  const subscriptionRecord: UserSubscription = {
    planId: subscriptionData.planId,
    status: "active",
    billing: subscriptionData.billing,
    paidAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    amountPaid: subscriptionData.amountPaid,
    transactionId,
    paymentMethod: subscriptionData.paymentMethod,
    plan,
  };

  // 1. Update Supabase user metadata
  try {
    await supabase.auth.updateUser({
      data: {
        subscription: subscriptionRecord,
      },
    });
  } catch (err) {
    console.error("Failed to update user_metadata in Supabase:", err);
  }

  // 2. Save in localStorage for immediate sync across views
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptionRecord));
      if (subscriptionData.hotelId) {
        localStorage.setItem(
          `${STORAGE_KEY}_${subscriptionData.hotelId}`,
          JSON.stringify(subscriptionRecord)
        );
      }
      // Dispatch custom event to notify open components
      window.dispatchEvent(
        new CustomEvent("meraresto:subscription-updated", {
          detail: subscriptionRecord,
        })
      );
    } catch {
      // LocalStorage fallback
    }
  }

  return subscriptionRecord;
}

/**
 * Checks if user has an active, paid subscription
 */
export function hasActiveSubscription(user?: User | null, hotelId?: string): boolean {
  const sub = getStoredSubscription(user, hotelId);
  if (!sub) return false;
  return sub.status === "active" || sub.status === "trialing";
}

/**
 * Checks if plan allows table creation within quota
 */
export function canAddTable(currentTableCount: number, planId: SubscriptionPlanId = "starter"): boolean {
  const plan = SUBSCRIPTION_PLANS[planId];
  if (!plan) return false;
  return currentTableCount < plan.maxTables;
}

/**
 * Checks if plan allows menu item creation within quota
 */
export function canAddMenuItem(currentMenuItemCount: number, planId: SubscriptionPlanId = "starter"): boolean {
  const plan = SUBSCRIPTION_PLANS[planId];
  if (!plan) return false;
  return currentMenuItemCount < plan.maxMenuItems;
}

/**
 * Checks if plan includes KDS
 */
export function canAccessKDS(planId: SubscriptionPlanId = "starter"): boolean {
  const plan = SUBSCRIPTION_PLANS[planId];
  return !!plan?.kdsEnabled;
}
