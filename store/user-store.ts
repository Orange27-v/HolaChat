import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber: string;
}

interface UserState {
  userInfo: UserInfo;
  isOnboardingComplete: boolean;
  updateUserInfo: (info: Partial<UserInfo>) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const initialUserInfo: UserInfo = {
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  phoneNumber: '',
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userInfo: initialUserInfo,
      isOnboardingComplete: false,
      
      updateUserInfo: (info) => {
        set((state) => ({
          userInfo: {
            ...state.userInfo,
            ...info,
          },
        }));
      },
      
      completeOnboarding: () => {
        set({ isOnboardingComplete: true });
      },
      
      resetOnboarding: () => {
        set({
          userInfo: initialUserInfo,
          isOnboardingComplete: false,
        });
      },
    }),
    {
      name: 'food-ordering-user',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);