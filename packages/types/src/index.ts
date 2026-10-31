export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// -------------------------------------------------------------
// USER & RBAC
// -------------------------------------------------------------
export type MemberRole = "owner" | "manager" | "chef" | "waiter" | "cashier";
export type UserRole = MemberRole;

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
  is_platform_admin: boolean;
  is_super_admin?: boolean;
  created_at: string;
  updated_at: string;
}

export interface RestaurantMember {
  id: string;
  restaurant_id: string;
  user_id: string;
  role: MemberRole;
  created_at: string;
  profile?: Profile;
}

// -------------------------------------------------------------
// RESTAURANT & MULTI-TENANCY
// -------------------------------------------------------------
export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  logo_url: string | null;
  banner_url: string | null;
  primary_color: string;
  currency: string;
  currency_symbol: string;
  contact_email: string | null;
  contact_phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Backward-compatible alias for existing QResto code
export type Hotel = Restaurant & {
  owner_id?: string;
  address?: string | null;
  phone?: string | null;
};

export interface Outlet {
  id: string;
  restaurant_id: string;
  name: string;
  address: string;
  city: string;
  state: string | null;
  postal_code: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
}

// -------------------------------------------------------------
// SUBSCRIPTIONS & PLANS
// -------------------------------------------------------------
export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid";

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_monthly: number;
  price_annual: number;
  max_outlets: number;
  max_tables_per_outlet: number;
  max_menu_items: number;
  kds_enabled: boolean;
  analytics_enabled: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  restaurant_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  razorpay_subscription_id: string | null;
  created_at: string;
  updated_at: string;
  plan?: Plan;
}

// -------------------------------------------------------------
// MENU & CATALOG
// -------------------------------------------------------------
export interface Category {
  id: string;
  restaurant_id: string;
  outlet_id?: string | null;
  name: string;
  sort_order: number;
  is_active?: boolean;
  created_at: string;
  // Backward-compatibility
  hotel_id?: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  base_price?: number;
  image_url: string | null;
  is_veg: boolean;
  is_available: boolean;
  preparation_time_mins?: number;
  sort_order?: number;
  created_at: string;
  updated_at?: string;
  // Backward-compatibility
  hotel_id?: string;
}

export interface ItemVariant {
  id: string;
  restaurant_id: string;
  menu_item_id: string;
  name: string;
  price: number;
  is_available: boolean;
  created_at: string;
}

export interface AddOn {
  id: string;
  restaurant_id: string;
  menu_item_id: string;
  name: string;
  price: number;
  is_available: boolean;
  created_at: string;
}

// -------------------------------------------------------------
// TABLES & QR CODES
// -------------------------------------------------------------
export interface DiningTable {
  id: string;
  restaurant_id: string;
  outlet_id: string;
  table_number: number;
  capacity?: number;
  seating_area?: string;
  is_active: boolean;
  created_at: string;
  // Backward-compatibility
  hotel_id?: string;
}

export type RestaurantTable = DiningTable;

export interface QRCodeRecord {
  id: string;
  restaurant_id: string;
  table_id: string;
  token: string;
  target_url: string;
  scan_count: number;
  created_at: string;
}

// -------------------------------------------------------------
// ORDERS & KITCHEN (KDS)
// -------------------------------------------------------------
export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "served"
  | "completed"
  | "rejected"
  | "cancelled"
  | "PENDING"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "COMPLETED"
  | "CANCELLED";

export interface Order {
  id: string;
  restaurant_id: string;
  outlet_id?: string | null;
  table_id?: string | null;
  table_number: number;
  customer_name: string | null;
  customer_phone: string | null;
  note?: string | null;
  special_instructions?: string | null;
  subtotal?: number;
  tax_amount?: number;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  updated_at?: string;
  // Backward-compatibility
  hotel_id?: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  variant_id?: string | null;
  item_name: string;
  variant_name?: string | null;
  price: number;
  unit_price?: number;
  quantity: number;
  total_price?: number;
  selected_addons?: Json;
  created_at: string;
}

export interface OrderStatusLog {
  id: string;
  order_id: string;
  previous_status: OrderStatus | null;
  new_status: OrderStatus;
  changed_by: string | null;
  notes: string | null;
  created_at: string;
}

// -------------------------------------------------------------
// REVIEWS & PAYMENTS
// -------------------------------------------------------------
export interface Review {
  id: string;
  restaurant_id: string;
  hotel_id?: string;
  order_id: string;
  customer_name: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
}

export type PaymentMethod = "cash" | "upi_qr" | "card_pos" | "online_gateway";
export type PaymentStatus = "pending" | "completed" | "refunded" | "failed";

export interface Payment {
  id: string;
  restaurant_id: string;
  order_id: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transaction_ref: string | null;
  created_at: string;
}

// -------------------------------------------------------------
// GUEST CART (CLIENT STATE)
// -------------------------------------------------------------
export interface CartItem {
  menu_item_id: string;
  variant_id?: string;
  name: string;
  variant_name?: string;
  price: number;
  is_veg: boolean;
  image_url: string | null;
  quantity: number;
  selected_addons?: AddOn[];
  special_instructions?: string;
}

