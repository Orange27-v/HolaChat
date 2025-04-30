import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useChatStore } from '@/store/chat-store';
import { useUserStore } from '@/store/user-store';
import ChatBubble from '@/components/ChatBubble';
import ChatInput from '@/components/ChatInput';
import TypingIndicator from '@/components/TypingIndicator';
import OnboardingScreen from '@/components/OnboardingScreen';
import Colors from '@/constants/colors';

export default function ChatScreen() {
  const { messages, isTyping, handleInitialGreeting } = useChatStore();
  const { isOnboardingComplete } = useUserStore();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Show initial greeting if no messages and onboarding is complete
    if (messages.length === 0 && isOnboardingComplete) {
      handleInitialGreeting();
    }
  }, [isOnboardingComplete]);

  if (!isOnboardingComplete) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <OnboardingScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.messagesContainer}
          inverted
          showsVerticalScrollIndicator={false}
        />
        {isTyping && <TypingIndicator />}
        <ChatInput />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  messagesContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
});