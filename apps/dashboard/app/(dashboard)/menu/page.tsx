"use client";

import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input, Modal } from "@meraresto/ui";
import { formatCurrency } from "@meraresto/utils";

interface Category {
  id: string;
  name: string;
  itemCount: number;
}

interface MenuItem {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  price: number;
  isVeg: boolean;
  isAvailable: boolean;
  description: string;
}

const INITIAL_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Starters", itemCount: 4 },
  { id: "cat-2", name: "Mains", itemCount: 6 },
  { id: "cat-3", name: "Breads", itemCount: 3 },
  { id: "cat-4", name: "Beverages", itemCount: 4 },
];

const INITIAL_ITEMS: MenuItem[] = [
  {
    id: "item-1",
    name: "Paneer Butter Masala",
    categoryId: "cat-2",
    categoryName: "Mains",
    price: 320,
    isVeg: true,
    isAvailable: true,
    description: "Cottage cheese simmered in a rich tomato, butter, and cashew gravy.",
  },
  {
    id: "item-2",
    name: "Murgh Tikka Masala",
    categoryId: "cat-2",
    categoryName: "Mains",
    price: 380,
    isVeg: false,
    isAvailable: true,
    description: "Charcoal-grilled chicken chunks in a spiced onion-tomato masala.",
  },
  {
    id: "item-3",
    name: "Crispy Corn & Salt Pepper",
    categoryId: "cat-1",
    categoryName: "Starters",
    price: 240,
    isVeg: true,
    isAvailable: true,
    description: "Sweet corn tossed with scallions and crushed black pepper.",
  },
  {
    id: "item-4",
    name: "Butter Garlic Naan",
    categoryId: "cat-3",
    categoryName: "Breads",
    price: 65,
    isVeg: true,
    isAvailable: true,
    description: "Tandoor baked flatbread brushed with garlic butter.",
  },
  {
    id: "item-5",
    name: "Masala Chai",
    categoryId: "cat-4",
    categoryName: "Beverages",
    price: 60,
    isVeg: true,
    isAvailable: false,
    description: "Brewed milk tea infused with crushed ginger and cardamom.",
  },
];

export default function MenuCatalogPage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [items, setItems] = useState<MenuItem[]>(INITIAL_ITEMS);
  const [selectedCat, setSelectedCat] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  // Modal States
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  // New Item Form
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("cat-1");
  const [itemPrice, setItemPrice] = useState("");
  const [itemIsVeg, setItemIsVeg] = useState(true);
  const [itemDesc, setItemDesc] = useState("");

  // New Category Form
  const [newCatName, setNewCatName] = useState("");

  const toggleAvailability = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isAvailable: !i.isAvailable } : i))
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !itemPrice) return;

    const cat = categories.find((c) => c.id === itemCategory);
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name: itemName,
      categoryId: itemCategory,
      categoryName: cat?.name || "General",
      price: parseFloat(itemPrice) || 0,
      isVeg: itemIsVeg,
      isAvailable: true,
      description: itemDesc,
    };

    setItems((prev) => [newItem, ...prev]);
    setIsItemModalOpen(false);
    setItemName("");
    setItemPrice("");
    setItemDesc("");
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      itemCount: 0,
    };

    setCategories((prev) => [...prev, newCategory]);
    setIsCatModalOpen(false);
    setNewCatName("");
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCat !== "ALL" && item.categoryId !== selectedCat) return false;
      if (
        search &&
        !item.name.toLowerCase().includes(search.toLowerCase()) &&
        !item.description.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [items, selectedCat, search]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/80">
        <div>
          <h2 className="text-xl font-bold text-[#0B192C]">Menu & Food Catalog</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage your categories, items, prices, and live availability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsCatModalOpen(true)}
            className="border-zinc-300 text-xs"
          >
            <Layers className="h-3.5 w-3.5 mr-1 text-[#0E8388]" />
            Add Category
          </Button>
          <Button
            size="sm"
            onClick={() => setIsItemModalOpen(true)}
            className="bg-[#0B192C] hover:bg-zinc-800 text-white text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Food Item
          </Button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedCat("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              selectedCat === "ALL"
                ? "bg-[#0B192C] text-white shadow-2xs"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            All Items ({items.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                selectedCat === cat.id
                  ? "bg-[#0B192C] text-white shadow-2xs"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              {cat.name} ({items.filter((i) => i.categoryId === cat.id).length})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-64 relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search items by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white pl-8 pr-3 py-1.5 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-hidden focus:border-[#0E8388]"
          />
        </div>
      </div>

      {/* Items Table Card */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-y border-zinc-100 bg-zinc-50/50 text-zinc-500 font-medium">
                <tr>
                  <th className="py-3 px-6">Item</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Type</th>
                  <th className="py-3 px-6">Price</th>
                  <th className="py-3 px-6">Availability</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-6">
                      <p className="font-semibold text-zinc-900">{item.name}</p>
                      <p className="text-[11px] text-zinc-400 truncate max-w-xs">
                        {item.description}
                      </p>
                    </td>
                    <td className="py-3.5 px-6 font-medium text-zinc-600">
                      {item.categoryName}
                    </td>
                    <td className="py-3.5 px-6">
                      <Badge variant={item.isVeg ? "veg" : "non-veg"}>
                        {item.isVeg ? "VEG" : "NON-VEG"}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-6 font-bold text-zinc-900">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="py-3.5 px-6">
                      <button
                        onClick={() => toggleAvailability(item.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                          item.isAvailable
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-zinc-100 text-zinc-500 border border-zinc-200"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            item.isAvailable ? "bg-emerald-500" : "bg-zinc-400"
                          }`}
                        />
                        {item.isAvailable ? "Available" : "Sold Out"}
                      </button>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => toggleAvailability(item.id)}
                        className="text-xs text-zinc-500 hover:text-[#0E8388] font-medium"
                      >
                        Toggle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Item Modal */}
      <Modal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        title="Add Food Item"
      >
        <form onSubmit={handleAddItem} className="space-y-4">
          <Input
            label="Item Name"
            placeholder="e.g. Butter Chicken"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />

          <div>
            <label className="text-xs font-semibold text-zinc-700 mb-1 block">
              Category
            </label>
            <select
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-800 focus:outline-hidden focus:border-[#0E8388]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Price (₹ INR)"
            type="number"
            placeholder="e.g. 350"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            required
          />

          <div>
            <label className="text-xs font-semibold text-zinc-700 mb-1 block">
              Food Type
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-xs text-zinc-700 cursor-pointer">
                <input
                  type="radio"
                  checked={itemIsVeg}
                  onChange={() => setItemIsVeg(true)}
                  name="vegOption"
                />
                Vegetarian
              </label>
              <label className="flex items-center gap-1.5 text-xs text-zinc-700 cursor-pointer">
                <input
                  type="radio"
                  checked={!itemIsVeg}
                  onChange={() => setItemIsVeg(false)}
                  name="vegOption"
                />
                Non-Vegetarian
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 mb-1 block">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Freshly prepared with authentic Indian spices..."
              value={itemDesc}
              onChange={(e) => setItemDesc(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs text-zinc-800 focus:outline-hidden focus:border-[#0E8388]"
            />
          </div>

          <Button type="submit" className="w-full bg-[#0B192C] hover:bg-zinc-800 text-white">
            Save Item to Menu
          </Button>
        </form>
      </Modal>

      {/* Add Category Modal */}
      <Modal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        title="Add Menu Category"
      >
        <form onSubmit={handleAddCategory} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Clay Oven Tandoori"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            required
          />

          <Button type="submit" className="w-full bg-[#0B192C] hover:bg-zinc-800 text-white">
            Create Category
          </Button>
        </form>
      </Modal>
    </div>
  );
}
