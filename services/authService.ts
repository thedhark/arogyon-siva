export type AuthMode = 'phone' | 'email';

export interface SendOtpParams {
  identifier: string; // phone number (e.g. "+91 9876543210") or email ("user@gmail.com")
  mode: AuthMode;
}

export interface VerifyOtpParams {
  identifier: string;
  code: string;
  mode: AuthMode;
}

export interface SocialProfile {
  name: string;
  email: string;
  avatar: string;
  provider: 'google' | 'apple';
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  isNewUser?: boolean;
  message?: string;
  user?: SocialProfile;
}

/**
 * Lightweight, pluggable Auth & OTP Service.
 * Supports Phone OTP, Gmail/Email OTP, and Google & Apple OAuth Sign-in.
 */
class AuthService {
  async sendOtp({ identifier, mode }: SendOtpParams): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const cleanId = identifier.trim();
    if (!cleanId) {
      return { success: false, message: 'Please enter a valid phone number or email.' };
    }

    if (mode === 'phone') {
      const digitsOnly = cleanId.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        return { success: false, message: 'Please enter a valid 10-digit mobile number.' };
      }
    } else if (mode === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanId)) {
        return { success: false, message: 'Please enter a valid email address.' };
      }
    }

    return {
      success: true,
      message: `OTP sent successfully to ${cleanId}`,
    };
  }

  async verifyOtp({ identifier, code }: VerifyOtpParams): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const cleanCode = code.trim();
    if (cleanCode.length === 4) {
      const isNew = !identifier.includes('9876543210') && !identifier.includes('sridhar');
      return {
        success: true,
        token: `jwt-${Date.now()}`,
        isNewUser: isNew,
      };
    }

    return {
      success: false,
      message: 'Invalid verification code. Please try again.',
    };
  }

  async loginWithSocial(profile: SocialProfile): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      success: true,
      token: `oauth-${profile.provider}-${Date.now()}`,
      isNewUser: false,
      user: profile,
    };
  }
}

export const authService = new AuthService();
