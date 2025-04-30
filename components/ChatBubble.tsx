import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Message, Restaurant, MenuItem, CartItem } from '@/types';
import Colors from '@/constants/colors';
import { useCartStore } from '@/store/cart-store';
import { useChatStore } from '@/store/chat-store';
import { ShoppingCart, Minus, Plus, ChevronRight } from 'lucide-react-native';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.user._id === 1;
  const { addItem, removeItem, updateQuantity } = useCartStore();
  const { handleCuisineSelection, handleRestaurantSelection, handleMenuItemSelection } = useChatStore();

  const renderQuickReplies = () => {
    if (!message.quickReplies) return null;

    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickRepliesContainer}
      >
        {message.quickReplies.values.map((reply, index) => (
          <TouchableOpacity
            key={index}
            style={styles.quickReplyButton}
            onPress={() => {
              if (reply.value === 'view_cart') {
                useChatStore.getState().handleViewCart();
              } else if (reply.value === 'checkout') {
                useChatStore.getState().handleCheckout();
              } else if (reply.value === 'order_more') {
                // If we have a current restaurant, show its menu again
                const currentRestaurantId = useChatStore.getState().currentRestaurantId;
                if (currentRestaurantId) {
                  useChatStore.getState().handleRestaurantSelection(currentRestaurantId);
                } else {
                  useChatStore.getState().showCuisineOptions();
                }
              } else if (reply.value === 'clear_cart') {
                useCartStore.getState().clearCart();
                useChatStore.getState().addMessage({
                  _id: Date.now().toString(),
                  text: "Your cart has been cleared.",
                  createdAt: new Date(),
                  user: {
                    _id: 2,
                    name: 'FoodBot',
                    avatar: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                  },
                });
              } else if (reply.value === 'new_order' || reply.value === 'browse_cuisines') {
                useChatStore.getState().showCuisineOptions();
              } else {
                // Handle cuisine selection
                handleCuisineSelection(reply.value);
              }
            }}
          >
            <Text style={styles.quickReplyText}>{reply.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderRestaurants = () => {
    if (!message.isRestaurants || !message.data) return null;

    const restaurants = message.data as Restaurant[];

    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.restaurantsContainer}
      >
        {restaurants.map((restaurant) => (
          <TouchableOpacity
            key={restaurant.id}
            style={styles.restaurantCard}
            onPress={() => handleRestaurantSelection(restaurant.id)}
          >
            <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <Text style={styles.restaurantDetails}>
                ⭐ {restaurant.rating} • {restaurant.deliveryTime}
              </Text>
              <Text style={styles.restaurantDetails}>
                {restaurant.deliveryFee} delivery
              </Text>
            </View>
            <ChevronRight size={16} color={Colors.subtext} style={styles.chevron} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderMenuItems = () => {
    if (!message.isMenuItems || !message.data) return null;

    const items = message.data as MenuItem[];

    return (
      <View style={styles.menuItemsContainer}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItemCard}
            onPress={() => handleMenuItemSelection(item.id)}
          >
            <Image source={{ uri: item.image }} style={styles.menuItemImage} />
            <View style={styles.menuItemInfo}>
              <Text style={styles.menuItemName}>{item.name}</Text>
              <Text style={styles.menuItemDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <ChevronRight size={16} color={Colors.subtext} style={styles.chevron} />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderCart = () => {
    if (!message.isCart || !message.data) return null;

    const cartItems = message.data as CartItem[];

    return (
      <View style={styles.cartContainer}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.cartItemCard}>
            <Image source={{ uri: item.image }} style={styles.cartItemImage} />
            <View style={styles.cartItemInfo}>
              <Text style={styles.cartItemName}>{item.name}</Text>
              <Text style={styles.cartItemPrice}>
                ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
            <View style={styles.cartItemActions}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, item.quantity - 1)}
              >
                <Minus size={16} color={Colors.text} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Plus size={16} color={Colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={styles.cartTotal}>
          <Text style={styles.cartTotalText}>
            Total: ${cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.botContainer
    ]}>
      {!isUser && message.user.avatar && (
        <Image source={{ uri: message.user.avatar }} style={styles.avatar} />
      )}
      <View style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.botBubble
      ]}>
        <Text style={[
          styles.text,
          isUser ? styles.userText : styles.botText
        ]}>
          {message.text}
        </Text>
        {message.image && (
          <Image source={{ uri: message.image }} style={styles.messageImage} />
        )}
        {renderQuickReplies()}
        {renderRestaurants()}
        {renderMenuItems()}
        {renderCart()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  botContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: Colors.chatBubbleUser,
  },
  botBubble: {
    backgroundColor: Colors.chatBubbleBot,
  },
  text: {
    fontSize: 16,
  },
  userText: {
    color: 'white',
  },
  botText: {
    color: Colors.text,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  messageImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginTop: 8,
  },
  quickRepliesContainer: {
    marginTop: 10,
    paddingBottom: 5,
  },
  quickReplyButton: {
    backgroundColor: 'white',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickReplyText: {
    color: Colors.text,
    fontSize: 14,
  },
  restaurantsContainer: {
    marginTop: 10,
    paddingBottom: 5,
  },
  restaurantCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: 220,
    marginRight: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  restaurantImage: {
    width: '100%',
    height: 120,
  },
  restaurantInfo: {
    padding: 10,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  restaurantDetails: {
    fontSize: 12,
    color: Colors.subtext,
    marginBottom: 2,
  },
  menuItemsContainer: {
    marginTop: 10,
    width: 280,
  },
  menuItemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuItemImage: {
    width: 80,
    height: 80,
  },
  menuItemInfo: {
    flex: 1,
    padding: 10,
  },
  menuItemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 12,
    color: Colors.subtext,
    marginBottom: 4,
  },
  menuItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  cartContainer: {
    marginTop: 10,
    width: 280,
  },
  cartItemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cartItemImage: {
    width: 60,
    height: 60,
  },
  cartItemInfo: {
    flex: 1,
    padding: 8,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 12,
    color: Colors.subtext,
  },
  cartItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  cartTotal: {
    marginTop: 8,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cartTotalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  chevron: {
    alignSelf: 'center',
    marginRight: 10,
  },
});

export default ChatBubble;