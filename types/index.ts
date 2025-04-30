export interface Restaurant {
    id: string;
    name: string;
    image: string;
    cuisine: string;
    rating: number;
    deliveryTime: string;
    deliveryFee: string;
  }
  
  export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    restaurantId: string;
  }
  
  export interface CartItem extends MenuItem {
    quantity: number;
  }
  
  export interface Message {
    _id: string;
    text: string;
    createdAt: Date;
    user: {
      _id: number;
      name: string;
      avatar?: string;
    };
    image?: string;
    quickReplies?: {
      type: 'radio' | 'checkbox';
      values: {
        title: string;
        value: string;
        image?: string;
      }[];
    };
    isOptions?: boolean;
    isRestaurants?: boolean;
    isMenuItems?: boolean;
    isCart?: boolean;
    data?: any;
  }