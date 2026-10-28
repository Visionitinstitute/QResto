export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "served"
  | "completed"
  | "rejected";

export interface Hotel {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  address: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  hotel_id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface MenuItem {
  id: string;
  hotel_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_veg: boolean;
  is_available: boolean;
  created_at: string;
}

export interface RestaurantTable {
  id: string;
  hotel_id: string;
  table_number: number;
  created_at: string;
}

export interface Order {
  id: string;
  hotel_id: string;
  table_number: number;
  customer_name: string | null;
  customer_phone: string | null;
  note: string | null;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  item_name: string;
  price: number;
  quantity: number;
  created_at: string;
}

export interface Review {
  id: string;
  hotel_id: string;
  order_id: string;
  customer_name: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
}

// Frontend & Cart Types
export interface CartItem {
  menu_item_id: string;
  name: string;
  price: number;
  is_veg: boolean;
  image_url: string | null;
  quantity: number;
}
