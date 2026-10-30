"use client";

import React, { useState, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  UtensilsCrossed,
  Search,
  ShoppingBag,
  Plus,
  Minus,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  User,
  Phone,
} from "lucide-react";
import { Badge, Button, Modal, Input } from "@meraresto/ui";
import { formatCurrency } from "@meraresto/utils";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  image?: string;
}

const SAMPLE_MENU: MenuItem[] = [
  {
    id: "item-1",
    name: "Paneer Butter Masala",
    description: "Cottage cheese simmered in a rich tomato, butter, and cashew gravy.",
    price: 320,
    category: "Mains",
    isVeg: true,
  },
  {
    id: "item-2",
    name: "Murgh Tikka Masala",
    description: "Charcoal-grilled chicken chunks in a spiced onion-tomato masala.",
    price: 380,
    category: "Mains",
    isVeg: false,
  },
  {
    id: "item-3",
    name: "Crispy Corn & Salt Pepper",
    description: "Tender sweet corn tossed with herbs, scallions and black pepper.",
    price: 240,
    category: "Starters",
    isVeg: true,
  },
  {
    id: "item-4",
    name: "Tandoori Chicken (Half)",
    description: "Classic spiced bone-in chicken roasted to perfection in clay oven.",
    price: 310,
    category: "Starters",
    isVeg: false,
  },
  {
    id: "item-5",
    name: "Butter Garlic Naan",
    description: "Fresh leavened bread baked in tandoor and brushed with garlic butter.",
    price: 65,
    category: "Breads",
    isVeg: true,
  },
  {
    id: "item-6",
    name: "Masala Chai",
    description: "Slow-brewed royal tea infused with fresh ginger and crushed cardamom.",
    price: 60,
    category: "Beverages",
    isVeg: true,
  },
];

export default function RestaurantMenuPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = (params?.slug as string) || "balkumari";
  const table = searchParams?.get("table") || "1";

  const [activeCategory, setActiveCategory] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ["All", "Starters", "Mains", "Breads", "Beverages"];

  const filteredItems = useMemo(() => {
    return SAMPLE_MENU.filter((item) => {
      if (activeCategory !== "All" && item.category !== activeCategory) return false;
      if (vegOnly && !item.isVeg) return false;
      if (
        searchQuery &&
        !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [activeCategory, vegOnly, searchQuery]);

  const addToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const copy = { ...prev };
      if (copy[id] > 1) {
        copy[id] -= 1;
      } else {
        delete copy[id];
      }
      return copy;
    });
  };

  const cartTotalCount = Object.values(cart).reduce((sum, q) => sum + q, 0);
  const cartSubtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = SAMPLE_MENU.find((i) => i.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        restaurantId: slug,
        tableId: table,
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
        specialInstructions: instructions.trim() || undefined,
        items: Object.entries(cart).map(([menuItemId, quantity]) => ({
          menuItemId,
          quantity,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const finalOrderId = data?.orderId || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

      setIsReviewOpen(false);
      router.push(`/order/${finalOrderId}?table=${table}&slug=${slug}`);
    } catch {
      // Graceful fallback for local demo
      const fallbackOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      setIsReviewOpen(false);
      router.push(`/order/${fallbackOrderId}?table=${table}&slug=${slug}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0B192C]">
      {/* Restaurant Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0B192C] text-white">
              <UtensilsCrossed className="h-5 w-5 text-[#0E8388]" />
            </div>
            <div>
              <h2 className="text-sm font-bold capitalize leading-none text-[#0B192C]">
                {slug.replace("-", " ")}
              </h2>
              <span className="text-[10px] text-zinc-500 font-medium">Digital QR Menu</span>
            </div>
          </div>
          <Badge variant="teal" className="text-xs px-2.5 py-1">
            Table {table}
          </Badge>
        </div>

        {/* Search input */}
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search dishes, drinks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-zinc-100 pl-9 pr-4 py-2 text-xs text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-[#0E8388]/30 focus:outline-hidden transition-all"
          />
        </div>

        {/* Categories Bar & Veg Filter */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
              vegOnly
                ? "bg-emerald-500 text-white border-emerald-600"
                : "bg-white text-emerald-700 border-emerald-300"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block bg-current" />
            Veg Only
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-3 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-[#0B192C] text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Food Items List */}
      <main className="p-4 space-y-3 pb-24">
        {filteredItems.map((item) => {
          const qty = cart[item.id] || 0;
          return (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 p-3.5 rounded-xl border border-zinc-100 bg-[#fafaf9]/60 hover:bg-white transition-all shadow-2xs"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant={item.isVeg ? "veg" : "non-veg"} className="text-[10px]">
                    {item.isVeg ? "VEG" : "NON-VEG"}
                  </Badge>
                  <span className="text-[10px] text-zinc-400 font-medium">
                    {item.category}
                  </span>
                </div>

                <h3 className="mt-1 text-sm font-semibold text-zinc-900">{item.name}</h3>
                <p className="mt-0.5 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-2 text-sm font-bold text-[#0B192C]">
                  {formatCurrency(item.price)}
                </div>
              </div>

              {/* Add / Qty Controls */}
              <div className="shrink-0 flex flex-col items-end justify-center self-center">
                {qty === 0 ? (
                  <button
                    onClick={() => addToCart(item.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-teal-300 bg-white px-3 py-1.5 text-xs font-semibold text-[#0E8388] shadow-2xs hover:bg-teal-50 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    ADD
                  </button>
                ) : (
                  <div className="flex items-center gap-2 rounded-lg bg-[#0B192C] text-white px-2 py-1 shadow-xs">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-0.5 hover:opacity-80"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{qty}</span>
                    <button
                      onClick={() => addToCart(item.id)}
                      className="p-0.5 hover:opacity-80"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </main>

      {/* Sticky Bottom Cart Bar */}
      {cartTotalCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 max-w-md mx-auto">
          <div className="flex items-center justify-between rounded-2xl bg-[#0B192C] px-5 py-3.5 text-white shadow-xl">
            <div>
              <p className="text-[11px] text-zinc-300 font-medium">
                {cartTotalCount} {cartTotalCount === 1 ? "item" : "items"} | Table {table}
              </p>
              <p className="text-base font-extrabold text-white">
                {formatCurrency(cartSubtotal)}
              </p>
            </div>

            <button
              onClick={() => setIsReviewOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0E8388] px-4 py-2 text-xs font-bold text-white hover:bg-teal-600 transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              View Cart
              <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
            </button>
          </div>
        </div>
      )}

      {/* Order Review Modal */}
      <Modal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        title={`Confirm Order — Table ${table}`}
      >
        <div className="space-y-4">
          <div className="divide-y divide-zinc-100 max-h-48 overflow-y-auto pr-1">
            {Object.entries(cart).map(([id, qty]) => {
              const item = SAMPLE_MENU.find((i) => i.id === id);
              if (!item) return null;
              return (
                <div key={id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex-1 pr-2">
                    <span className="font-semibold text-zinc-900">{item.name}</span>
                    <span className="text-zinc-500 block text-[11px]">
                      {qty} × {formatCurrency(item.price)}
                    </span>
                  </div>
                  <div className="font-bold text-zinc-900">
                    {formatCurrency(item.price * qty)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-100">
            <Input
              label="Your Name (Optional)"
              placeholder="e.g. Rahul Sharma"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            <div>
              <label className="text-[11px] font-medium text-zinc-600 mb-1 block">
                Cooking Instructions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Less spicy, extra lemons..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-800 focus:outline-hidden focus:border-[#0E8388]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-sm font-bold text-zinc-900">
            <span>Total Payable:</span>
            <span className="text-[#0E8388]">{formatCurrency(cartSubtotal)}</span>
          </div>

          <Button
            onClick={handlePlaceOrder}
            isLoading={isSubmitting}
            className="w-full bg-[#0B192C] hover:bg-zinc-800 text-white"
          >
            Send Order to Kitchen
          </Button>
        </div>
      </Modal>
    </div>
  );
}
