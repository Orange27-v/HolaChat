import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useCartStore } from '@/store/cart-store';
import { useChatStore } from '@/store/chat-store';
import { useUserStore } from '@/store/user-store';
import Colors from '@/constants/colors';
import { LogOut, Settings, CreditCard, MapPin, Clock, MessageSquare, Edit } from 'lucide-react-native';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { clearCart } = useCartStore();
  const { resetChat } = useChatStore();
  const { userInfo, resetOnboarding } = useUserStore();

  const handleResetApp = () => {
    clearCart();
    resetChat();
    resetOnboarding();
  };

  const formatAddress = () => {
    const parts = [
      userInfo.address,
      userInfo.city,
      `${userInfo.state} ${userInfo.zipCode}`,
      userInfo.country
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.contentContainer}
    >
      <StatusBar style="dark" />
      
      <View style={styles.profileHeader}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }} 
          style={styles.profileImage} 
        />
        <Text style={styles.profileName}>{userInfo.firstName} {userInfo.lastName}</Text>
        <Text style={styles.profileEmail}>{userInfo.phoneNumber}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemIcon}>
            <Settings size={20} color={Colors.text} />
          </View>
          <Text style={styles.menuItemText}>Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemIcon}>
            <CreditCard size={20} color={Colors.text} />
          </View>
          <Text style={styles.menuItemText}>Payment Methods</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemIcon}>
            <MapPin size={20} color={Colors.text} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemText}>Delivery Address</Text>
            <Text style={styles.menuItemSubtext}>{formatAddress()}</Text>
          </View>
          <View style={styles.editButton}>
            <Edit size={16} color={Colors.primary} />
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Orders</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemIcon}>
            <Clock size={20} color={Colors.text} />
          </View>
          <Text style={styles.menuItemText}>Order History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemIcon}>
            <MessageSquare size={20} color={Colors.text} />
          </View>
          <Text style={styles.menuItemText}>Support</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleResetApp}>
          <LogOut size={20} color="white" />
          <Text style={styles.logoutText}>Reset App</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: Colors.subtext,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.text,
  },
  menuItemSubtext: {
    fontSize: 14,
    color: Colors.subtext,
    marginTop: 4,
  },
  editButton: {
    padding: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  versionText: {
    textAlign: 'center',
    color: Colors.subtext,
    marginTop: 20,
    fontSize: 14,
  },
});