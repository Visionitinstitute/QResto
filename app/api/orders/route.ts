import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface OrderRequestItem {
  menu_item_id: string;
  quantity: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      hotel_id,
      table_number,
      customer_name,
      customer_phone,
      note,
      items,
    }: {
      hotel_id?: string;
      table_number?: number;
      customer_name?: string;
      customer_phone?: string;
      note?: string;
      items?: OrderRequestItem[];
    } = body;

    // 1. Basic Validations
    if (!hotel_id) {
      return NextResponse.json(
        { error: "Hotel ID zaroori hai." },
        { status: 400 }
      );
    }

    const tableNum = Number(table_number);
    if (!tableNum || tableNum <= 0) {
      return NextResponse.json(
        { error: "Kripya sahi table number darj karein." },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart khali hai. Kripya pehle items jodein." },
        { status: 400 }
      );
    }

    // Max quantity sanity check
    for (const it of items) {
      if (!it.menu_item_id || !it.quantity || it.quantity <= 0) {
        return NextResponse.json(
          { error: "Invalid item quantity in order." },
          { status: 400 }
        );
      }
      if (it.quantity > 50) {
        return NextResponse.json(
          { error: "Ek item ki adhikam quantity 50 ho sakti hai." },
          { status: 400 }
        );
      }
    }

    const supabase = await createClient();

    // 2. Fetch server-side pricing & availability for all ordered items
    const itemIds = items.map((i) => i.menu_item_id);
    const { data: dbItems, error: itemsError } = await supabase
      .from("menu_items")
      .select("id, name, price, is_available")
      .eq("hotel_id", hotel_id)
      .in("id", itemIds);

    if (itemsError || !dbItems || dbItems.length === 0) {
      return NextResponse.json(
        { error: "Menu items verify nahi ho sake." },
        { status: 400 }
      );
    }

    const dbItemsMap = new Map(dbItems.map((i) => [i.id, i]));

    let calculatedTotal = 0;
    const orderItemsToInsert: Array<{
      menu_item_id: string;
      item_name: string;
      price: number;
      quantity: number;
    }> = [];

    for (const it of items) {
      const dbItem = dbItemsMap.get(it.menu_item_id);
      if (!dbItem) {
        return NextResponse.json(
          { error: "Kuch items menu me uplabdh nahi hain." },
          { status: 400 }
        );
      }

      if (!dbItem.is_available) {
        return NextResponse.json(
          {
            error: `"${dbItem.name}" abhi out of stock ho gaya hai. Kripya ise cart se hatayein.`,
          },
          { status: 400 }
        );
      }

      const itemTotal = Number(dbItem.price) * it.quantity;
      calculatedTotal += itemTotal;

      orderItemsToInsert.push({
        menu_item_id: dbItem.id,
        item_name: dbItem.name,
        price: Number(dbItem.price),
        quantity: it.quantity,
      });
    }

    // 3. Insert into `orders` table
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        hotel_id,
        table_number: tableNum,
        customer_name: customer_name?.trim() || null,
        customer_phone: customer_phone?.trim() || null,
        note: note?.trim() || null,
        total_amount: calculatedTotal,
        status: "pending",
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order creation error:", orderError);
      return NextResponse.json(
        { error: "Order place karne me samasya aayi: " + orderError?.message },
        { status: 500 }
      );
    }

    // 4. Insert into `order_items` table
    const itemsWithOrderId = orderItemsToInsert.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: orderItemsError } = await supabase
      .from("order_items")
      .insert(itemsWithOrderId);

    if (orderItemsError) {
      console.error("Order items creation error:", orderItemsError);
      // Clean up order if order_items insert failed
      await supabase.from("orders").delete().eq("id", order.id);
      return NextResponse.json(
        { error: "Order items record karne me samasya aayi." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      total_amount: calculatedTotal,
    });
  } catch (err: unknown) {
    console.error("Orders API route error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Internal server error occurred.",
      },
      { status: 500 }
    );
  }
}
