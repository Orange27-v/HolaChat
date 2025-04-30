import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, MenuItem } from '@/types';

interface CartState {
  items: CartItem[];
  selectedRestaurantId: string | null;
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedRestaurantId: null,
      
      addItem: (item: MenuItem) => {
        const { items, selectedRestaurantId } = get();
        
        // If cart is empty, set the restaurant
        if (items.length === 0) {
          set({ selectedRestaurantId: item.restaurantId });
        }
        
        // Check if item is from the same restaurant
        if (selectedRestaurantId && selectedRestaurantId !== item.restaurantId) {
          // Handle different restaurant case
          return;
        }
        
        // Check if item already exists in cart
        const existingItem = items.find((cartItem) => cartItem.id === item.id);
        
        if (existingItem) {
          // Update quantity if item exists
          set({
            items: items.map((cartItem) =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            ),
          });
        } else {
          // Add new item with quantity 1
          set({
            items: [...items, { ...item, quantity: 1 }],
          });
        }
      },
      
      removeItem: (itemId: string) => {
        const { items } = get();
        const newItems = items.filter((item) => item.id !== itemId);
        
        // If cart becomes empty, reset restaurant
        if (newItems.length === 0) {
          set({ selectedRestaurantId: null });
        }
        
        set({ items: newItems });
      },
      
      updateQuantity: (itemId: string, quantity: number) => {
        const { items } = get();
        
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          get().removeItem(itemId);
          return;
        }
        
        set({
          items: items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        });
      },
      
      clearCart: () => {
        set({ items: [], selectedRestaurantId: null });
      },
      
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'food-ordering-cart',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);