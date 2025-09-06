import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser, authService } from '../lib/auth';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
  isAdmin: () => boolean;
  isManager: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: true,

      setUser: (user) => set({ user, loading: false }),
      setLoading: (loading) => set({ loading }),

      signIn: async (email: string, password: string) => {
        set({ loading: true });
        try {
          await authService.signIn(email, password);
          const user = await authService.getCurrentUser();
          set({ user, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      signUp: async (email: string, password: string, userData?: any) => {
        set({ loading: true });
        try {
          await authService.signUp(email, password, userData);
          const user = await authService.getCurrentUser();
          set({ user, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      signOut: async () => {
        set({ loading: true });
        try {
          await authService.signOut();
          set({ user: null, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      updateProfile: async (updates: any) => {
        const user = await authService.updateProfile(updates);
        set({ user });
      },

      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      },

      isManager: () => {
        const { user } = get();
        return user?.role === 'manager' || user?.role === 'admin';
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
);