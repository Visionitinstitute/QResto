import { SupabaseClient } from "@supabase/supabase-js";
import {
  Restaurant,
  DiningTable,
  Category,
  MenuItem,
  Order,
  OrderItem,
  OrderStatus,
  UserRole,
} from "@meraresto/types";

/**
 * Fetch a restaurant record by its unique URL slug.
 */
export async function getRestaurantBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<Restaurant | null> {
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data as Restaurant;
}

/**
 * Fetch a restaurant record by its UUID.
 */
export async function getRestaurantById(
  supabase: SupabaseClient,
  id: string
): Promise<Restaurant | null> {
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Restaurant;
}

/**
 * Fetch full active digital menu for a restaurant (categories + items).
 */
export async function getRestaurantMenu(
  supabase: SupabaseClient,
  restaurantId: string
): Promise<{ categories: Category[]; items: MenuItem[] }> {
  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
    supabase
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .eq("is_available", true)
      .order("display_order", { ascending: true }),
  ]);

  return {
    categories: (categories || []) as Category[],
    items: (items || []) as MenuItem[],
  };
}

/**
 * Fetch dining tables for a restaurant.
 */
export async function getDiningTables(
  supabase: SupabaseClient,
  restaurantId: string
): Promise<DiningTable[]> {
  const { data, error } = await supabase
    .from("dining_tables")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("table_number", { ascending: true });

  if (error) return [];
  return (data || []) as DiningTable[];
}

/**
 * Fetch active orders for kitchen display or restaurant dashboard.
 */
export async function getRestaurantOrders(
  supabase: SupabaseClient,
  restaurantId: string,
  statuses?: OrderStatus[]
): Promise<Order[]> {
  let query = supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false });

  if (statuses && statuses.length > 0) {
    query = query.in("status", statuses);
  }

  const { data, error } = await query;
  if (error) return [];
  return (data || []) as Order[];
}

/**
 * Securely place an order with server-side price validation.
 * Client-submitted prices are discarded and queried directly from DB to prevent tampering.
 */
export async function createValidatedOrder(
  supabase: SupabaseClient,
  params: {
    restaurantId: string;
    tableId?: string;
    customerName?: string;
    customerPhone?: string;
    specialInstructions?: string;
    items: Array<{
      menuItemId: string;
      quantity: number;
      specialInstructions?: string;
    }>;
  }
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  if (!params.items || params.items.length === 0) {
    return { success: false, error: "Order must contain at least one item." };
  }

  // 1. Fetch official item prices from DB
  const itemIds = params.items.map((i) => i.menuItemId);
  const { data: menuItems, error: fetchErr } = await supabase
    .from("menu_items")
    .select("id, name, base_price, is_available")
    .eq("restaurant_id", params.restaurantId)
    .in("id", itemIds);

  if (fetchErr || !menuItems) {
    return { success: false, error: "Failed to verify menu items." };
  }

  const priceMap = new Map<string, { name: string; price: number }>();
  for (const item of menuItems) {
    if (!item.is_available) {
      return { success: false, error: `Item "${item.name}" is currently unavailable.` };
    }
    priceMap.set(item.id, { name: item.name, price: Number(item.base_price) });
  }

  // 2. Calculate verified total
  let subtotal = 0;
  const orderItemsData: Array<{
    menu_item_id: string;
    item_name: string;
    unit_price: number;
    quantity: number;
    total_price: number;
    special_instructions?: string;
  }> = [];

  for (const reqItem of params.items) {
    const dbItem = priceMap.get(reqItem.menuItemId);
    if (!dbItem) {
      return { success: false, error: `Invalid item selected: ${reqItem.menuItemId}` };
    }
    const lineTotal = dbItem.price * reqItem.quantity;
    subtotal += lineTotal;

    orderItemsData.push({
      menu_item_id: reqItem.menuItemId,
      item_name: dbItem.name,
      unit_price: dbItem.price,
      quantity: reqItem.quantity,
      total_price: lineTotal,
      special_instructions: reqItem.specialInstructions,
    });
  }

  const taxAmount = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST
  const totalAmount = subtotal + taxAmount;
  const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

  // 3. Insert parent order
  const { data: orderData, error: orderErr } = await supabase
    .from("orders")
    .insert({
      restaurant_id: params.restaurantId,
      table_id: params.tableId,
      order_number: orderNumber,
      status: "PENDING",
      payment_status: "PENDING",
      subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      customer_name: params.customerName,
      customer_phone: params.customerPhone,
      special_instructions: params.specialInstructions,
    })
    .select("id")
    .single();

  if (orderErr || !orderData) {
    return { success: false, error: orderErr?.message || "Failed to create order." };
  }

  // 4. Insert order items
  const itemsToInsert = orderItemsData.map((item) => ({
    ...item,
    order_id: orderData.id,
  }));

  const { error: itemsErr } = await supabase
    .from("order_items")
    .insert(itemsToInsert);

  if (itemsErr) {
    return { success: false, error: "Failed to persist order items." };
  }

  return { success: true, orderId: orderData.id };
}

/**
 * Update order status with audit log.
 */
export async function updateOrderStatus(
  supabase: SupabaseClient,
  orderId: string,
  newStatus: OrderStatus,
  changedByUserId?: string,
  notes?: string
): Promise<boolean> {
  const { data: currentOrder } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();

  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) return false;

  // Insert audit status log
  await supabase.from("order_status_logs").insert({
    order_id: orderId,
    previous_status: currentOrder?.status,
    new_status: newStatus,
    changed_by: changedByUserId,
    notes,
  });

  return true;
}
