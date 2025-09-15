import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { User } from '@/features/users/domain/types';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create(
  immer<UserState>((set) => ({
    user: null,
    isAuthenticated: false,
    setUser: (user) => set({ user, isAuthenticated: true }),
    clearUser: () => set({ user: null, isAuthenticated: false }),
  }))
);
