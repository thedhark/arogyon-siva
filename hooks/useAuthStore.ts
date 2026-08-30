import { create } from 'zustand';
import { authService, AuthMode, AuthResponse, SocialProfile } from '@/services/authService';
import { useProfileStore } from '@/hooks/useProfileStore';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  authMode: AuthMode;
  identifier: string;
  isLoading: boolean;
  error: string | null;

  setAuthMode: (mode: AuthMode) => void;
  setIdentifier: (identifier: string) => void;
  sendOtp: (overrideIdentifier?: string, overrideMode?: AuthMode) => Promise<boolean>;
  verifyOtp: (code: string) => Promise<AuthResponse>;
  loginWithSocial: (profile: SocialProfile) => Promise<AuthResponse>;
  logout: () => void;
  resetError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  token: null,
  authMode: 'phone',
  identifier: '',
  isLoading: false,
  error: null,

  setAuthMode: (mode) => set({ authMode: mode, error: null }),
  setIdentifier: (identifier) => set({ identifier, error: null }),

  sendOtp: async (overrideIdentifier, overrideMode) => {
    const id = overrideIdentifier ?? get().identifier;
    const mode = overrideMode ?? get().authMode;
    set({ isLoading: true, error: null });

    try {
      const res = await authService.sendOtp({ identifier: id, mode });
      if (res.success) {
        set({ identifier: id, authMode: mode, isLoading: false });
        return true;
      } else {
        set({ error: res.message || 'Failed to send OTP', isLoading: false });
        return false;
      }
    } catch {
      set({ error: 'Network error. Please try again.', isLoading: false });
      return false;
    }
  },

  verifyOtp: async (code: string) => {
    const { identifier, authMode } = get();
    set({ isLoading: true, error: null });

    try {
      const res = await authService.verifyOtp({ identifier, code, mode: authMode });
      if (res.success && res.token) {
        set({
          isAuthenticated: true,
          token: res.token,
          isLoading: false,
          error: null,
        });

        // Sync with central profile store
        if (authMode === 'phone') {
          useProfileStore.getState().updateUserProfile({ phone: identifier });
        } else {
          useProfileStore.getState().updateUserProfile({ email: identifier });
        }
      } else {
        set({ error: res.message || 'Invalid OTP', isLoading: false });
      }
      return res;
    } catch {
      const errRes: AuthResponse = { success: false, message: 'Verification error' };
      set({ error: errRes.message, isLoading: false });
      return errRes;
    }
  },

  loginWithSocial: async (profile: SocialProfile) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.loginWithSocial(profile);
      if (res.success && res.token) {
        set({
          isAuthenticated: true,
          token: res.token,
          authMode: 'email',
          identifier: profile.email,
          isLoading: false,
        });

        // Sync Google/Gmail or Apple user info into profile
        useProfileStore.getState().updateUserProfile({
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar,
        });
      }
      return res;
    } catch {
      set({ error: 'Social login failed', isLoading: false });
      return { success: false, message: 'Social login failed' };
    }
  },

  logout: () => {
    set({
      isAuthenticated: false,
      token: null,
      identifier: '',
      error: null,
      isLoading: false,
    });
  },

  resetError: () => set({ error: null }),
}));
