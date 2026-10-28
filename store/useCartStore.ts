import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, MenuItem } from "@/types";

interface CartStore {
  hotelId: string | null;
  tableNumber: number | null;
  items: CartItem[];

  // Actions
  addItem: (item: MenuItem, hotelId: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  setTableNumber: (tableNumber: number | null) => void;
  clearCart: () => void;
  getItemQuantity: (menuItemId: string) => number;
  getTotalItems: () => number;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      hotelId: null,
      tableNumber: null,
      items: [],

      addItem: (item: MenuItem, currentHotelId: string) => {
        const { hotelId, items } = get();

        // If switching to a different hotel's menu, clear old items
        let currentItems = items;
        if (hotelId && hotelId !== currentHotelId) {
          currentItems = [];
        }

        const existingItem = currentItems.find((i) => i.menu_item_id === item.id);

        let updatedItems: CartItem[];
        if (existingItem) {
          updatedItems = currentItems.map((i) =>
            i.menu_item_id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          updatedItems = [
            ...currentItems,
            {
              menu_item_id: item.id,
              name: item.name,
              price: item.price,
              is_veg: item.is_veg,
              image_url: item.image_url,
              quantity: 1,
            },
          ];
        }

        set({
          hotelId: currentHotelId,
          items: updatedItems,
        });
      },

      removeItem: (menuItemId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.menu_item_id !== menuItemId),
        }));
      },

      updateQuantity: (menuItemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.menu_item_id === menuItemId ? { ...i, quantity } : i
          ),
        }));
      },

      setTableNumber: (tableNumber: number | null) => {
        set({ tableNumber });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemQuantity: (menuItemId: string) => {
        const item = get().items.find((i) => i.menu_item_id === menuItemId);
        return item ? item.quantity : 0;
      },

      getTotalItems: () => {
        return get().items.reduce((acc, curr) => acc + curr.quantity, 0);
      },

      getTotalAmount: () => {
        return get().items.reduce(
          (acc, curr) => acc + curr.price * curr.quantity,
          0
        );
      },
    }),
    {
      name: "qresto-customer-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
