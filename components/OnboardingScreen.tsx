import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Animated,
  Keyboard
} from 'react-native';
import { useUserStore } from '@/store/user-store';
import Colors from '@/constants/colors';
import { Send } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  isInput?: boolean;
  inputType?: 'text' | 'number';
  inputPlaceholder?: string;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  options?: Array<{
    text: string;
    value: string;
    onPress: () => void;
  }>;
}

const OnboardingScreen: React.FC = () => {
  const { updateUserInfo, completeOnboarding } = useUserStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phoneNumber: '',
  });
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Define the conversation flow
  const conversationSteps = [
    {
      botMessage: "👋 Hi there! I'm your food ordering assistant. Let's set up your profile so I can help you order delicious food. What's your first name?",
      inputField: {
        placeholder: "Enter your first name",
        onSubmit: (value: string) => {
          setFormData(prev => ({ ...prev, firstName: value }));
          return true; // proceed to next step
        }
      }
    },
    {
      botMessage: (firstName: string) => `Nice to meet you, ${firstName}! What's your last name?`,
      inputField: {
        placeholder: "Enter your last name",
        onSubmit: (value: string) => {
          setFormData(prev => ({ ...prev, lastName: value }));
          return true;
        }
      }
    },
    {
      botMessage: "Great! Now, where should we deliver your food? What's your street address?",
      inputField: {
        placeholder: "Enter your street address",
        onSubmit: (value: string) => {
          setFormData(prev => ({ ...prev, address: value }));
          return true;
        }
      }
    },
    {
      botMessage: "And what city are you in?",
      inputField: {
        placeholder: "Enter your city",
        onSubmit: (value: string) => {
          setFormData(prev => ({ ...prev, city: value }));
          return true;
        }
      }
    },
    {
      botMessage: "What state do you live in?",
      inputField: {
        placeholder: "Enter your state",
        onSubmit: (value: string) => {
          setFormData(prev => ({ ...prev, state: value }));
          return true;
        }
      }
    },
    {
      botMessage: "What's your zip code?",
      inputField: {
        placeholder: "Enter your zip code",
        inputType: "number",
        onSubmit: (value: string) => {
          setFormData(prev => ({ ...prev, zipCode: value }));
          return true;
        }
      }
    },
    {
      botMessage: "Finally, what's your phone number so we can contact you about your order?",
      inputField: {
        placeholder: "Enter your phone number",
        inputType: "number",
        onSubmit: (value: string) => {
          setFormData(prev => ({ ...prev, phoneNumber: value }));
          return true;
        }
      }
    },
    {
      botMessage: (data: any) => `Perfect! Here's what I've got:
      
Name: ${data.firstName} ${data.lastName}
Address: ${data.address}, ${data.city}, ${data.state} ${data.zipCode}
Phone: ${data.phoneNumber}

Is this information correct?`,
      options: [
        {
          text: "Yes, it's correct",
          value: "confirm",
          onPress: () => {
            // Save user info and complete onboarding
            updateUserInfo(formData);
            
            // Add final message
            addBotMessage("Great! Your profile is all set up. Let's start ordering some delicious food!");
            
            // Delay completion to allow user to read the message
            setTimeout(() => {
              completeOnboarding();
            }, 2000);
            
            return false; // don't automatically proceed
          }
        },
        {
          text: "No, let me edit",
          value: "edit",
          onPress: () => {
            // Go back to first step
            setCurrentStep(0);
            // Clear messages except the first welcome message
            setMessages(messages.slice(0, 2));
            return false;
          }
        }
      ]
    }
  ];

  // Start the conversation
  useEffect(() => {
    startConversation();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  // Handle step changes
  useEffect(() => {
    if (currentStep > 0 && currentStep < conversationSteps.length) {
      showNextBotMessage();
    }
  }, [currentStep]);

  const startConversation = () => {
    setMessages([]);
    setTimeout(() => {
      addBotMessage(conversationSteps[0].botMessage);
      addInputField(conversationSteps[0].inputField);
    }, 500);
  };

  const addBotMessage = (text: string) => {
    setIsTyping(true);
    
    // Animate typing indicator
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    // Simulate typing delay based on message length
    const typingDelay = Math.min(1000, Math.max(500, text.length * 20));
    
    setTimeout(() => {
      setIsTyping(false);
      
      // Fade out typing indicator
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      // Add the actual message
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text,
          isUser: false
        }
      ]);
    }, typingDelay);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        text,
        isUser: true
      }
    ]);
  };

  const addInputField = (inputField: any) => {
    if (!inputField) return;
    
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString() + "-input",
        text: "",
        isUser: true,
        isInput: true,
        inputType: inputField.inputType || "text",
        inputPlaceholder: inputField.placeholder,
        inputValue: currentInput,
        onInputChange: (value: string) => setCurrentInput(value)
      }
    ]);
  };

  const addOptions = (options: any[]) => {
    if (!options || options.length === 0) return;
    
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString() + "-options",
        text: "",
        isUser: false,
        options
      }
    ]);
  };

  const showNextBotMessage = () => {
    const step = conversationSteps[currentStep];
    
    // Handle dynamic messages that are functions
    let messageText = typeof step.botMessage === 'function' 
      ? step.botMessage(currentStep === conversationSteps.length - 1 ? formData : formData.firstName)
      : step.botMessage;
    
    addBotMessage(messageText);
    
    // Add input field or options
    if (step.inputField) {
      setTimeout(() => {
        addInputField(step.inputField);
      }, 1000);
    } else if (step.options) {
      setTimeout(() => {
        addOptions(step.options);
      }, 1000);
    }
  };

  const handleSendMessage = () => {
    if (currentInput.trim() === "") return;
    
    // Trigger haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Get current step
    const step = conversationSteps[currentStep];
    
    // Add user message
    addUserMessage(currentInput);
    
    // Process input
    if (step.inputField && step.inputField.onSubmit) {
      const shouldProceed = step.inputField.onSubmit(currentInput);
      
      if (shouldProceed) {
        // Move to next step
        setCurrentStep(prev => prev + 1);
      }
    }
    
    // Clear input
    setCurrentInput("");
    
    // Remove input field from messages
    setMessages(prev => prev.filter(msg => !msg.isInput));
    
    // Dismiss keyboard
    Keyboard.dismiss();
  };

  const renderMessage = (message: ChatMessage) => {
    if (message.isInput) {
      return (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={message.inputPlaceholder}
            value={currentInput}
            onChangeText={(text) => setCurrentInput(text)}
            keyboardType={message.inputType === 'number' ? 'number-pad' : 'default'}
            autoFocus
          />
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={currentInput.trim() === ""}
          >
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      );
    }
    
    if (message.options) {
      return (
        <View style={styles.optionsContainer}>
          {message.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => {
                // Trigger haptic feedback
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                
                // Add user selection as a message
                addUserMessage(option.text);
                
                // Call the option's onPress handler
                option.onPress();
              }}
            >
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    
    return (
      <View style={[
        styles.messageBubble,
        message.isUser ? styles.userBubble : styles.botBubble
      ]}>
        <Text style={[
          styles.messageText,
          message.isUser ? styles.userText : styles.botText
        ]}>
          {message.text}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Food Chat</Text>
        <Text style={styles.headerSubtitle}>Setup your profile</Text>
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(message => (
          <View 
            key={message.id}
            style={[
              styles.messageRow,
              message.isUser ? styles.userRow : styles.botRow
            ]}
          >
            {renderMessage(message)}
          </View>
        ))}
        
        {isTyping && (
          <Animated.View 
            style={[
              styles.messageRow,
              styles.botRow,
              { opacity: fadeAnim }
            ]}
          >
            <View style={[styles.messageBubble, styles.botBubble, styles.typingBubble]}>
              <View style={styles.typingIndicator}>
                <View style={styles.typingDot} />
                <View style={[styles.typingDot, styles.typingDotMiddle]} />
                <View style={styles.typingDot} />
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.subtext,
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
    paddingBottom: 30,
  },
  messageRow: {
    marginBottom: 15,
    flexDirection: 'row',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  botRow: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
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
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: 'white',
  },
  botText: {
    color: Colors.text,
  },
  typingBubble: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 10,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.subtext,
    marginHorizontal: 2,
    opacity: 0.6,
  },
  typingDotMiddle: {
    marginTop: -5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    marginBottom: 10,
    marginTop: 5,
    width: '100%',
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },
  optionsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 5,
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionText: {
    color: Colors.text,
    fontSize: 14,
  },
});

export default OnboardingScreen;