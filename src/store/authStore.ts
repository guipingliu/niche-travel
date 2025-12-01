import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (email: string, password: string) => {
        // Mock authentication
        if (email === 'admin@example.com' && password === 'password') {
          set({
            isAuthenticated: true,
            user: {
              id: '1',
              name: 'Admin User',
              email: 'admin@example.com',
              role: 'admin',
            },
          });
        } else {
          throw new Error('Invalid credentials');
        }
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },
      initialize: () => {
        // Check if user is authenticated from stored state
        // This is handled by persist middleware
      },
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
    }
  )
);