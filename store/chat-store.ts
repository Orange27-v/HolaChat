import { create } from 'zustand';
import { Message } from '@/types';
import { restaurants } from '@/mocks/restaurants';
import { menuItems } from '@/mocks/menu-items';
import { cuisines } from '@/mocks/cuisines';
import { useCartStore } from './cart-store';
import { useUserStore } from './user-store';

interface ChatState {
  messages: Message[];
  isTyping: boolean;
  currentRestaurantId: string | null;
  addMessage: (message: Message) => void;
  sendUserMessage: (text: string) => void;
  handleInitialGreeting: () => void;
  handleCuisineSelection: (cuisine: string) => void;
  handleRestaurantSelection: (restaurantId: string) => void;
  handleMenuItemSelection: (itemId: string) => void;
  handleViewCart: () => void;
  handleCheckout: () => void;
  resetChat: () => void;
  showCuisineOptions: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isTyping: false,
  currentRestaurantId: null,

  addMessage: (message) => {
    set((state) => ({
      messages: [message, ...state.messages],
    }));
  },

  sendUserMessage: (text) => {
    const newMessage: Message = {
      _id: Date.now().toString(),
      text,
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'User',
      },
    };

    set((state) => ({
      messages: [newMessage, ...state.messages],
      isTyping: true,
    }));

    // Process user message
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
        get().handleInitialGreeting();
      } else if (lowerText.includes('cuisine') || lowerText.includes('food') || lowerText.includes('eat')) {
        get().showCuisineOptions();
      } else if (lowerText.includes('cart')) {
        get().handleViewCart();
      } else if (lowerText.includes('checkout') || lowerText.includes('pay')) {
        get().handleCheckout();
      } else if (lowerText.includes('clear') || lowerText.includes('reset')) {
        get().resetChat();
        useCartStore.getState().clearCart();
      } else {
        // Default response
        get().addMessage({
          _id: Date.now().toString(),
          text: "I'm not sure what you mean. You can ask about cuisines, view your cart, or checkout.",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'FoodBot',
            avatar: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          },
        });
      }
      
      set({ isTyping: false });
    }, 1000);
  },

  handleInitialGreeting: () => {
    const { userInfo } = useUserStore.getState();
    const firstName = userInfo.firstName;
    
    get().addMessage({
      _id: Date.now().toString(),
      text: `Hello ${firstName}! I'm your food ordering assistant. What type of cuisine are you in the mood for today?`,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'FoodBot',
        avatar: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      },
    });
    
    setTimeout(() => {
      get().showCuisineOptions();
    }, 500);
  },

  showCuisineOptions: () => {
    get().addMessage({
      _id: Date.now().toString(),
      text: "Select a cuisine:",
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'FoodBot',
        avatar: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      },
      quickReplies: {
        type: 'radio',
        values: cuisines.map(cuisine => ({
          title: `${cuisine.emoji} ${cuisine.name}`,
          value: cuisine.name,
        })),
      },
      isOptions: true,
    });
  },

  handleCuisineSelection: (cuisine) => {
    // Add user selection as a message
    get().addMessage({
      _id: Date.now().toString(),
      text: `I'd like ${cuisine} food`,
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'User',
      },
    });
    
    set({ isTyping: true });
    
    setTimeout(() => {
      // Filter restaurants by cuisine
      const filteredRestaurants = restaurants.filter(
        (r) => r.cuisine.toLowerCase() === cuisine.toLowerCase()
      );
      
      if (filteredRestaurants.length > 0) {
        get().addMessage({
          _id: Date.now().toString(),
          text: `Great choice! Here are some ${cuisine} restaurants:`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'FoodBot',
            avatar: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          },
          isRestaurants: true,
          data: filteredRestaurants,
        });
      } else {
        get().addMessage({
          _id: Date.now().toString(),
          text: `I'm sorry, we don't have any ${cuisine} restaurants available right now. Would you like to try another cuisine?`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'FoodBot',
            avatar: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          },
        });
        
        setTimeout(() => {
          get().showCuisineOptions();
        }, 500);
      }
      
      set({ isTyping: false });
    }, 1000);
  },

  handleRestaurantSelection: (restaurantId) => {
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    
    if (!restaurant) return;
    
    // Add user selection as a message
    get().addMessage({
      _id: Date.now().toString(),
      text: `I'll order from ${restaurant.name}`,
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'User',
      },
    });
    
    set({ 
      isTyping: true,
      currentRestaurantId: restaurantId,
    });
    
    setTimeout(() => {
      const restaurantMenu = menuItems[restaurantId] || [];
      
      get().addMessage({
        _id: Date.now().toString(),
        text: `Here's the menu from ${restaurant.name}. What would you like to order?`,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'FoodBot',
          avatar: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        },
        isMenuItems: true,
        data: restaurantMenu,
      });
      
      set({ isTyping: false });
    }, 1000);
  },

  handleMenuItemSelection: (itemId) => {
    const { currentRestaurantId } = get();
    
    if (!currentRestaurantId) return;
    
    const menu = menuItems[currentRestaurantId] || [];
    const selectedItem = menu.find((item) => item.id === itemId);
    
    if (!selectedItem) return;
    
    // Add user selection as a message
    get().addMessage({
      _id: Date.now().toString(),
      text: `I'll have the ${selectedItem.name}`,
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'User',
      },
    });
    
    set({ isTyping: true });
    
    // Add to cart
    useCartStore.getState().addItem(selectedItem);
    
    setTimeout(() => {
      get().addMessage({
        _id: Date.now().toString(),
        text: `Great! I've added ${selectedItem.name} to your cart. Would you like to order anything else, view your cart, or proceed to checkout?`,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'FoodBot',
          avatar: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        },
        quickReplies: {
          type: 'radio',
          values: [
            { title: '🛒 View Cart', value: 'view_cart' },
            { title: '💳 Checkout', value: 'checkout' },
            { title: '➕ Order More', value: 'order_more' },
          ],
        },
      });
      
      set({ isTyping: false });
    }, 1000);
  },

  handleViewCart: () => {
    const cartItems = useCartStore.getState().items;
    const totalPrice = useCartStore.getState().getTotalPrice();
    
    if (cartItems.length === 0) {
      get().addMessage({
        _id: Date.now().toString(),
        text: "Your cart is empty. Would you like to browse some restaurants?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'FoodBot',
          avatar: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        },
        quickReplies: {
          type: 'radio',
          values: [
            { title: '🍽️ Browse Cuisines', value: 'browse_cuisines' },
          ],
        },
      });
      return;
    }
    
    get().addMessage({
      _id: Date.now().toString(),
      text: `Your Cart (Total: $${totalPrice.toFixed(2)})`,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'FoodBot',
        avatar: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      },
      isCart: true,
      data: cartItems,
    });
    
    setTimeout(() => {
      get().addMessage({
        _id: Date.now().toString(),
        text: "What would you like to do next?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'FoodBot',
          avatar: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        },
        quickReplies: {
          type: 'radio',
          values: [
            { title: '💳 Checkout', value: 'checkout' },
            { title: '➕ Order More', value: 'order_more' },
            { title: '🗑️ Clear Cart', value: 'clear_cart' },
          ],
        },
      });
    }, 500);
  },

  handleCheckout: () => {
    const cartItems = useCartStore.getState().items;
    const totalPrice = useCartStore.getState().getTotalPrice();
    const { userInfo } = useUserStore.getState();
    
    if (cartItems.length === 0) {
      get().addMessage({
        _id: Date.now().toString(),
        text: "Your cart is empty. Please add items before checking out.",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'FoodBot',
          avatar: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        },
      });
      return;
    }
    
    get().addMessage({
      _id: Date.now().toString(),
      text: `Proceeding to checkout. Your total is $${totalPrice.toFixed(2)}. Your order will be delivered to ${userInfo.address}, ${userInfo.city}, ${userInfo.state}.`,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'FoodBot',
        avatar: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      },
    });
    
    setTimeout(() => {
      get().addMessage({
        _id: Date.now().toString(),
        text: `Thank you for your order, ${userInfo.firstName}! It will be delivered in 30-45 minutes. Would you like to start a new order?`,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'FoodBot',
          avatar: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        },
        quickReplies: {
          type: 'radio',
          values: [
            { title: '✅ New Order', value: 'new_order' },
          ],
        },
      });
      
      // Clear cart after successful checkout
      useCartStore.getState().clearCart();
    }, 2000);
  },

  resetChat: () => {
    set({
      messages: [],
      isTyping: false,
      currentRestaurantId: null,
    });
    
    setTimeout(() => {
      get().handleInitialGreeting();
    }, 500);
  },
}));