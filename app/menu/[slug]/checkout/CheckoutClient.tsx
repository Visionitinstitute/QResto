"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingBag,
  UtensilsCrossed,
  User,
  Phone,
  FileText,
  AlertCircle,
  Hash,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useCartStore } from "@/store/useCartStore";

interface HotelData {
  id: string;
  name: string;
  slug: string;
  phone?: string | null;
  address?: string | null;
}

export default function CheckoutClient({ hotel }: { hotel: HotelData }) {
  const router = useRouter();
  const {
    items: cartItems,
    tableNumber,
    setTableNumber,
    clearCart,
    getTotalAmount,
  } = useCartStore();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [note, setNote] = useState("");
  const [tableInput, setTableInput] = useState<string>(
    tableNumber ? tableNumber.toString() : ""
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (tableNumber) {
      setTableInput(tableNumber.toString());
    }
  }, [tableNumber]);

  const totalAmount = mounted ? getTotalAmount() : 0;

  if (mounted && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl border border-zinc-200/80 p-8 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900">Aapka Cart Khali Hai</h2>
          <p className="text-xs text-zinc-500 mt-1 mb-6">
            Kripya pehle hotel menu se apni pasand ki dishes cart me jodein.
          </p>
          <Link href={`/menu/${hotel.slug}`}>
            <Button variant="primary" className="w-full">
              Menu Dekhein
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const parsedTable = parseInt(tableInput, 10);
    if (!parsedTable || parsedTable <= 0) {
      setErrorMessage("Kripya sahi Table Number enter karein (e.g. 1, 2, 5).");
      return;
    }

    // Save table number to store
    setTableNumber(parsedTable);
    setIsSubmitting(true);

    try {
      const payload = {
        hotel_id: hotel.id,
        table_number: parsedTable,
        customer_name: customerName.trim() || null,
        customer_phone: customerPhone.trim() || null,
        note: note.trim() || null,
        items: cartItems.map((item) => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
        })),
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Order place karne me samasya aayi.");
      }

      // Clear the cart upon successful order creation
      clearCart();

      // Redirect to the live order status page
      router.push(`/order/${data.order_id}`);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Kuch gadbad hui. Kripya punah prayas karein."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-zinc-200/80 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link
            href={`/menu/${hotel.slug}`}
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900"
          >
            <ArrowLeft className="w-4 h-4" /> Menu Par Wapas Jayein
          </Link>
          <span className="text-xs font-extrabold text-orange-600 uppercase tracking-wider">
            Order Checkout
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
            Order Confirm Karein
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            {hotel.name} • Apni table jankari darj karein
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-red-700 font-medium leading-relaxed">
              {errorMessage}
            </p>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="space-y-6">
          {/* 1. Table & Contact Details Card */}
          <Card className="p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-2 flex items-center gap-2">
              <Hash className="w-4 h-4 text-orange-600" /> Table & Contact Details
            </h2>

            <div>
              <label
                htmlFor="tableNumber"
                className="block text-xs font-bold text-zinc-800 mb-1"
              >
                Table Number *
              </label>
              <div className="relative">
                <Input
                  id="tableNumber"
                  type="number"
                  placeholder="e.g. 1, 2, 5"
                  value={tableInput}
                  onChange={(e) => setTableInput(e.target.value)}
                  className="pl-10"
                  min="1"
                  required
                />
                <Hash className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Aap jis table par baithe hain uska number enter karein.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="customerName"
                  className="block text-xs font-bold text-zinc-800 mb-1"
                >
                  Aapka Naam (Optional)
                </label>
                <div className="relative">
                  <Input
                    id="customerName"
                    type="text"
                    placeholder="Rahul"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="pl-10"
                  />
                  <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="customerPhone"
                  className="block text-xs font-bold text-zinc-800 mb-1"
                >
                  Mobile Number (Optional)
                </label>
                <div className="relative">
                  <Input
                    id="customerPhone"
                    type="tel"
                    placeholder="9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="pl-10"
                  />
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="cookingNote"
                className="block text-xs font-bold text-zinc-800 mb-1"
              >
                Special Cooking Instructions / Note
              </label>
              <div className="relative">
                <textarea
                  id="cookingNote"
                  rows={2}
                  placeholder="e.g. Kam mirch rakhna, extra tissue bhejna, spicy..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10"
                />
                <FileText className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>
          </Card>

          {/* 2. Order Summary Card */}
          <Card className="p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-2 flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-orange-600" /> Order Summary ({cartItems.length} items)
            </h2>

            <div className="divide-y divide-zinc-100">
              {cartItems.map((item) => (
                <div
                  key={item.menu_item_id}
                  className="py-2.5 flex items-center justify-between text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-orange-600">
                      {item.quantity}x
                    </span>
                    <span className="font-semibold text-zinc-800">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-bold text-zinc-900">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-zinc-200 flex items-center justify-between text-base font-black">
              <span>Payable Amount</span>
              <span className="text-orange-600 text-lg">₹{totalAmount}</span>
            </div>
            <p className="text-[11px] text-zinc-400 text-center">
              (Payment table par serve hone ke baad cash ya online scanner se kiya ja sakta hai)
            </p>
          </Card>

          {/* Place Order CTA */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full shadow-lg shadow-orange-600/30 text-base"
            isLoading={isSubmitting}
          >
            Place Order Now <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>
      </main>
    </div>
  );
}
