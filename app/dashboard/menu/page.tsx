"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  ChefHat,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Layers,
  Store,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { createClient } from "@/lib/supabase/client";
import { Category, MenuItem, Hotel } from "@/types";

export default function MenuManagementPage() {
  const [loading, setLoading] = useState(true);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);

  // Item Modal State
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemCategoryId, setItemCategoryId] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemImageUrl, setItemImageUrl] = useState("");
  const [itemIsVeg, setItemIsVeg] = useState(true);
  const [itemIsAvailable, setItemIsAvailable] = useState(true);
  const [savingItem, setSavingItem] = useState(false);

  // Inline Price Editing
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>("");

  // Delete Confirm State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "item" | "category";
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status Alerts
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Initial Load
  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: hotelData } = await supabase
            .from("hotels")
            .select("*")
            .eq("owner_id", user.id)
            .maybeSingle();

          if (hotelData) {
            setHotel(hotelData);

            const [catRes, itemRes] = await Promise.all([
              supabase
                .from("categories")
                .select("*")
                .eq("hotel_id", hotelData.id)
                .order("sort_order", { ascending: true }),
              supabase
                .from("menu_items")
                .select("*")
                .eq("hotel_id", hotelData.id)
                .order("created_at", { ascending: false }),
            ]);

            setCategories(catRes.data || []);
            setMenuItems(itemRes.data || []);
          }
        }
      } catch (err) {
        console.error("Error loading menu data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Filtered Menu Items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category_id === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description &&
          item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  // -------------------------------------------------------------
  // CATEGORY ACTIONS
  // -------------------------------------------------------------
  const openAddCategory = () => {
    setEditingCategory(null);
    setCategoryName("");
    setIsCategoryModalOpen(true);
  };

  const openEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotel || !categoryName.trim()) return;

    setSavingCategory(true);
    setFeedback(null);

    try {
      const supabase = createClient();
      if (editingCategory) {
        // Update
        const { error } = await supabase
          .from("categories")
          .update({ name: categoryName.trim() })
          .eq("id", editingCategory.id);

        if (error) throw error;

        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingCategory.id ? { ...c, name: categoryName.trim() } : c
          )
        );
        setFeedback({
          type: "success",
          text: `Category "${categoryName}" update ho gayi!`,
        });
      } else {
        // Insert
        const nextOrder = categories.length + 1;
        const { data, error } = await supabase
          .from("categories")
          .insert({
            hotel_id: hotel.id,
            name: categoryName.trim(),
            sort_order: nextOrder,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) setCategories((prev) => [...prev, data]);
        setFeedback({
          type: "success",
          text: `Nayi category "${categoryName}" add ho gayi!`,
        });
      }

      setIsCategoryModalOpen(false);
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Category save nahi ho saki.",
      });
    } finally {
      setSavingCategory(false);
    }
  };

  // -------------------------------------------------------------
  // MENU ITEM ACTIONS
  // -------------------------------------------------------------
  const openAddItem = () => {
    setEditingItem(null);
    setItemName("");
    setItemCategoryId(categories[0]?.id || "");
    setItemDescription("");
    setItemPrice("");
    setItemImageUrl("");
    setItemIsVeg(true);
    setItemIsAvailable(true);
    setIsItemModalOpen(true);
  };

  const openEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemCategoryId(item.category_id || "");
    setItemDescription(item.description || "");
    setItemPrice(item.price.toString());
    setItemImageUrl(item.image_url || "");
    setItemIsVeg(item.is_veg);
    setItemIsAvailable(item.is_available);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotel || !itemName.trim() || !itemPrice) return;

    setSavingItem(true);
    setFeedback(null);

    try {
      const supabase = createClient();
      const priceNum = parseFloat(itemPrice);

      if (isNaN(priceNum) || priceNum < 0) {
        throw new Error("Sahi price darj karein.");
      }

      const itemPayload = {
        hotel_id: hotel.id,
        category_id: itemCategoryId || null,
        name: itemName.trim(),
        description: itemDescription.trim() || null,
        price: priceNum,
        image_url: itemImageUrl.trim() || null,
        is_veg: itemIsVeg,
        is_available: itemIsAvailable,
      };

      if (editingItem) {
        const { error } = await supabase
          .from("menu_items")
          .update(itemPayload)
          .eq("id", editingItem.id);

        if (error) throw error;

        setMenuItems((prev) =>
          prev.map((it) =>
            it.id === editingItem.id ? { ...it, ...itemPayload } : it
          )
        );
        setFeedback({
          type: "success",
          text: `Dish "${itemName}" update ho gayi!`,
        });
      } else {
        const { data, error } = await supabase
          .from("menu_items")
          .insert(itemPayload)
          .select()
          .single();

        if (error) throw error;
        if (data) setMenuItems((prev) => [data, ...prev]);
        setFeedback({
          type: "success",
          text: `Nayi dish "${itemName}" add ho gayi!`,
        });
      }

      setIsItemModalOpen(false);
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Dish save nahi ho saki.",
      });
    } finally {
      setSavingItem(false);
    }
  };

  // Quick Inline Availability Toggle (Optimistic)
  const handleToggleAvailability = async (item: MenuItem) => {
    const newStatus = !item.is_available;
    // Optimistic UI update
    setMenuItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_available: newStatus } : i))
    );

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("menu_items")
        .update({ is_available: newStatus })
        .eq("id", item.id);

      if (error) {
        // Revert on error
        setMenuItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, is_available: !newStatus } : i
          )
        );
        setFeedback({
          type: "error",
          text: "Status update nahi ho saka.",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Inline Price Save
  const handleSaveInlinePrice = async (itemId: string) => {
    const priceNum = parseFloat(tempPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      setEditingPriceId(null);
      return;
    }

    setMenuItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, price: priceNum } : i))
    );
    setEditingPriceId(null);

    try {
      const supabase = createClient();
      await supabase
        .from("menu_items")
        .update({ price: priceNum })
        .eq("id", itemId);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Action
  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);

    try {
      const supabase = createClient();
      if (deleteConfirm.type === "item") {
        const { error } = await supabase
          .from("menu_items")
          .delete()
          .eq("id", deleteConfirm.id);
        if (error) throw error;
        setMenuItems((prev) => prev.filter((i) => i.id !== deleteConfirm.id));
        setFeedback({ type: "success", text: "Dish delete ho gayi." });
      } else {
        const { error } = await supabase
          .from("categories")
          .delete()
          .eq("id", deleteConfirm.id);
        if (error) throw error;
        setCategories((prev) => prev.filter((c) => c.id !== deleteConfirm.id));
        if (selectedCategory === deleteConfirm.id) setSelectedCategory("all");
        setFeedback({ type: "success", text: "Category delete ho gayi." });
      }
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Delete nahi ho saka.",
      });
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-zinc-500">Menu load ho raha hai...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-zinc-200">
        <Store className="w-10 h-10 text-orange-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-zinc-900">Pehle apna hotel set up karein</h2>
        <Link href="/dashboard" className="mt-4 inline-block">
          <Button>Dashboard Overview par jayein</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            <ChefHat className="w-4 h-4 text-orange-600" /> Menu & Categories
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Apne restaurant ka live menu, rate aur categories yahan se manage karein.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={openAddCategory} className="h-8 text-xs">
            <Layers className="w-3.5 h-3.5 mr-1" /> + Category
          </Button>
          <Button variant="primary" size="sm" onClick={openAddItem} className="h-8 text-xs">
            <Plus className="w-3.5 h-3.5 mr-1" /> + Nayi Dish
          </Button>
        </div>
      </div>

      {/* Alert Feedback Banner */}
      {feedback && (
        <div
          className={`p-3 rounded-lg border flex items-start gap-2.5 animate-in fade-in ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          )}
          <p className="text-xs font-medium">{feedback.text}</p>
        </div>
      )}

      {/* Category Pills & Manage Row */}
      <div className="bg-white p-2 rounded-xl border border-zinc-200/80 shadow-2xs flex items-center gap-1.5 overflow-x-auto select-none">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition shrink-0 ${
            selectedCategory === "all"
              ? "bg-zinc-900 text-white shadow-2xs"
              : "bg-zinc-100 text-zinc-600 hover:text-zinc-900"
          }`}
        >
          All ({menuItems.length})
        </button>

        {categories.map((cat) => {
          const count = menuItems.filter((i) => i.category_id === cat.id).length;
          const isSelected = selectedCategory === cat.id;

          return (
            <div
              key={cat.id}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition ${
                isSelected
                  ? "bg-zinc-900 text-white shadow-2xs font-semibold"
                  : "bg-zinc-100 text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <button
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name} ({count})
              </button>
              <button
                onClick={() => openEditCategory(cat)}
                className="opacity-70 hover:opacity-100 p-0.5"
                title="Edit category"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={() =>
                  setDeleteConfirm({
                    type: "category",
                    id: cat.id,
                    name: cat.name,
                  })
                }
                className="opacity-70 hover:opacity-100 p-0.5 text-red-400 hover:text-red-600"
                title="Delete category"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Dish ka naam ya description se search karein..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Menu Items Table / Cards */}
      <Card className="overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 px-4">
            <ChefHat className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-800">
              Koi dish nahi mili
            </h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              Aapne abhi tak is category me koi dish add nahi ki hai, ya search se match nahi ho raha.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={openAddItem}
              className="mt-4"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Pehli Dish Jodein
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {filteredItems.map((item) => {
              const categoryName =
                categories.find((c) => c.id === item.category_id)?.name ||
                "General";

              return (
                <div
                  key={item.id}
                  className={`p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                    !item.is_available ? "bg-zinc-50/70 opacity-75" : "bg-white"
                  }`}
                >
                  {/* Left: Image & Info */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-orange-50 border border-orange-100 shrink-0 overflow-hidden flex items-center justify-center">
                      {item.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-orange-300" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-zinc-900 text-xs sm:text-sm">
                          {item.name}
                        </span>
                        <Badge variant={item.is_veg ? "veg" : "non-veg"} className="text-[10px] px-1.5 py-0">
                          {item.is_veg ? "Veg" : "Non-Veg"}
                        </Badge>
                        <span className="text-[10px] font-medium text-zinc-500 bg-zinc-100 px-1.5 py-0.2 rounded">
                          {categoryName}
                        </span>
                      </div>

                      {item.description && (
                        <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">
                          {item.description}
                        </p>
                      )}

                      {/* Inline Price on Mobile */}
                      <div className="sm:hidden mt-1 flex items-center gap-2">
                        <span className="font-bold text-zinc-900 text-xs">
                          ₹{item.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Inline Price, Availability Switch & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-zinc-100">
                    {/* Inline Price Desktop */}
                    <div className="hidden sm:flex items-center">
                      {editingPriceId === item.id ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-zinc-500">₹</span>
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            className="w-16 px-1.5 py-0.5 text-xs font-bold border border-orange-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveInlinePrice(item.id)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingPriceId(null)}
                            className="p-1 text-zinc-400 hover:bg-zinc-100 rounded"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingPriceId(item.id);
                            setTempPrice(item.price.toString());
                          }}
                          className="group flex items-center gap-1 px-2 py-0.5 rounded hover:bg-orange-50 transition"
                          title="Click to edit price"
                        >
                          <span className="text-xs font-bold text-zinc-900 group-hover:text-orange-600">
                            ₹{item.price}
                          </span>
                          <Edit2 className="w-2.5 h-2.5 text-zinc-300 group-hover:text-orange-500 opacity-0 group-hover:opacity-100 transition" />
                        </button>
                      )}
                    </div>

                    {/* Quick Availability Toggle Switch */}
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1.5 ${
                        item.is_available
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100"
                          : "bg-zinc-100 text-zinc-600 border border-zinc-200/80 hover:bg-zinc-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.is_available ? "bg-emerald-500" : "bg-zinc-400"
                        }`}
                      />
                      {item.is_available ? "In Stock" : "Sold Out"}
                    </button>

                    {/* Edit & Delete Buttons */}
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => openEditItem(item)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition"
                        title="Edit Dish"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            type: "item",
                            id: item.id,
                            name: item.name,
                          })
                        }
                        className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* ------------------------------------------------------------- */}
      {/* 1. ADD / EDIT CATEGORY MODAL                                  */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title={editingCategory ? "Edit Category" : "Nayi Category Jodein"}
        maxWidth="sm"
      >
        <form onSubmit={handleSaveCategory} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Category Name *
            </label>
            <Input
              type="text"
              placeholder="e.g. Starters, Main Course, Drinks"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsCategoryModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={savingCategory}
            >
              Save Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* 2. ADD / EDIT MENU ITEM MODAL                                 */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        title={editingItem ? "Dish Details Edit Karein" : "Nayi Dish Jodein"}
        maxWidth="md"
      >
        <form onSubmit={handleSaveItem} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Dish Ka Naam *
            </label>
            <Input
              type="text"
              placeholder="Paneer Tikka, Cold Coffee, Butter Naan"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Category *
              </label>
              <select
                value={itemCategoryId}
                onChange={(e) => setItemCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                required
              >
                <option value="">Category Chunein</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Price (₹) *
              </label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="250"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  className="pl-7"
                  min="0"
                  step="0.5"
                  required
                />
                <DollarSign className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Crispy fried sweet corn tossed with green chillies & fresh herbs"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Photo URL (Optional)
            </label>
            <Input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={itemImageUrl}
              onChange={(e) => setItemImageUrl(e.target.value)}
            />
          </div>

          {/* Veg / Non-Veg & Availability Radio / Switches */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1">
                Food Type
              </label>
              <div className="flex items-center gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={() => setItemIsVeg(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${
                    itemIsVeg
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-zinc-600 border-zinc-200"
                  }`}
                >
                  🟢 Veg
                </button>
                <button
                  type="button"
                  onClick={() => setItemIsVeg(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${
                    !itemIsVeg
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-zinc-600 border-zinc-200"
                  }`}
                >
                  🔴 Non-Veg
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1">
                Live Stock Status
              </label>
              <button
                type="button"
                onClick={() => setItemIsAvailable(!itemIsAvailable)}
                className={`mt-1.5 px-3 py-1 rounded-lg text-xs font-bold border transition ${
                  itemIsAvailable
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                    : "bg-zinc-200 text-zinc-600 border-zinc-300"
                }`}
              >
                {itemIsAvailable ? "✓ Available Now" : "✕ Out of Stock"}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsItemModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={savingItem}
            >
              Save Dish
            </Button>
          </div>
        </form>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* 3. CONFIRM DELETE DIALOG                                      */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
        maxWidth="sm"
      >
        <div className="pt-2 space-y-4">
          <p className="text-sm text-zinc-600">
            Kya aap sach me{" "}
            <span className="font-bold text-zinc-900">
              &quot;{deleteConfirm?.name}&quot;
            </span>{" "}
            ko delete karna chahte hain? Yeh wapas nahi laya ja sakega.
          </p>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              isLoading={isDeleting}
              onClick={handleConfirmDelete}
            >
              Yes, Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
