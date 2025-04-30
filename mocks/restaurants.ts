import { Restaurant } from '@/types';

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Sushi Paradise',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    cuisine: 'Japanese',
    rating: 4.8,
    deliveryTime: '25-35 min',
    deliveryFee: '$2.99',
  },
  {
    id: '2',
    name: 'Burger Joint',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    cuisine: 'American',
    rating: 4.5,
    deliveryTime: '15-25 min',
    deliveryFee: '$1.99',
  },
  {
    id: '3',
    name: 'Pizza Heaven',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    cuisine: 'Italian',
    rating: 4.6,
    deliveryTime: '20-30 min',
    deliveryFee: '$2.49',
  },
  {
    id: '4',
    name: 'Taco Fiesta',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    cuisine: 'Mexican',
    rating: 4.3,
    deliveryTime: '25-40 min',
    deliveryFee: '$3.49',
  },
  {
    id: '5',
    name: 'Smoothie Bar',
    image: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    cuisine: 'Healthy',
    rating: 4.7,
    deliveryTime: '10-20 min',
    deliveryFee: '$1.49',
  },
];