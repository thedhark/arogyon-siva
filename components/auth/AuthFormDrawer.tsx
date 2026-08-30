import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/hooks/useAuthStore';
import { ChevronDown, Mail, Phone } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import SocialAuthModal, { SocialUserOption } from './SocialAuthModal';

export default function AuthFormDrawer() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { authMode, setAuthMode, sendOtp, loginWithSocial, isLoading } = useAuthStore();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [validationError, setValidationError] = useState('');
  const [socialModalProvider, setSocialModalProvider] = useState<'google' | 'apple' | null>(null);

  const isPhoneMode = authMode === 'phone';
  const isFormValid = isPhoneMode
    ? phoneNumber.trim().length >= 10
    : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.trim());

  const handleContinue = async () => {
    setValidationError('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const identifier = isPhoneMode ? `+91${phoneNumber.trim()}` : emailAddress.trim();
    const success = await sendOtp(identifier, authMode);

    if (success) {
      router.push('/auth/verify');
    } else {
      setValidationError(isPhoneMode ? 'Enter a valid 10-digit number' : 'Enter a valid email address');
    }
  };

  const handleSocialClick = (provider: 'google' | 'apple' | 'email') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (provider === 'email') {
      setAuthMode(isPhoneMode ? 'email' : 'phone');
      setValidationError('');
    } else {
      setSocialModalProvider(provider);
    }
  };

  const handleSelectSocialAccount = async (account: SocialUserOption) => {
    if (!socialModalProvider) return;
    const res = await loginWithSocial({
      name: account.name,
      email: account.email,
      avatar: account.avatar,
      provider: socialModalProvider,
    });

    if (res.success) {
      setSocialModalProvider(null);
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#1E293B' }]}>
        {isPhoneMode ? 'Log in with Mobile' : 'Log in with Email'}
      </Text>

      {/* Input Row */}
      <View style={styles.inputRow}>
        {isPhoneMode ? (
          <>
            <View
              style={[
                styles.countryBox,
                {
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                },
              ]}
            >
              <Text style={styles.flagEmoji}>🇮🇳</Text>
              <ChevronDown size={14} color={isDark ? '#94A3B8' : '#64748B'} style={{ marginLeft: 4 }} />
            </View>

            <View
              style={[
                styles.inputBox,
                {
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  borderColor: validationError ? '#EF4444' : (isDark ? '#334155' : '#E2E8F0'),
                },
              ]}
            >
              <Text style={[styles.prefix, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>+91</Text>
              <TextInput
                style={[styles.textInput, { color: isDark ? '#FFFFFF' : '#0F172A' }]}
                placeholder="Mobile number"
                placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                keyboardType="phone-pad"
                maxLength={10}
                value={phoneNumber}
                onChangeText={(t) => {
                  setPhoneNumber(t);
                  setValidationError('');
                }}
              />
            </View>
          </>
        ) : (
          <View
            style={[
              styles.inputBox,
              {
                width: '100%',
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                borderColor: validationError ? '#EF4444' : (isDark ? '#334155' : '#E2E8F0'),
              },
            ]}
          >
            <Mail size={18} color={isDark ? '#94A3B8' : '#64748B'} style={{ marginRight: 10 }} />
            <TextInput
              style={[styles.textInput, { color: isDark ? '#FFFFFF' : '#0F172A' }]}
              placeholder="name@gmail.com"
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              keyboardType="email-address"
              autoCapitalize="none"
              value={emailAddress}
              onChangeText={(t) => {
                setEmailAddress(t);
                setValidationError('');
              }}
            />
          </View>
        )}
      </View>

      {validationError ? (
        <Text style={styles.errorText}>{validationError}</Text>
      ) : null}

      {/* Primary Continue Button */}
      <TouchableOpacity
        style={[
          styles.submitBtn,
          {
            backgroundColor: isFormValid
              ? '#10B981'
              : (isDark ? 'rgba(16, 185, 129, 0.3)' : '#A7F3D0'),
          },
        ]}
        onPress={handleContinue}
        disabled={!isFormValid || isLoading}
        activeOpacity={0.85}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.submitBtnText}>Continue</Text>
        )}
      </TouchableOpacity>

      {/* Social / Alternate Methods Row */}
      <View style={styles.socialRow}>
        {/* Google / Gmail Button */}
        <TouchableOpacity
          style={[
            styles.socialCircle,
            {
              backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
              borderColor: isDark ? '#334155' : '#F1F5F9',
            },
          ]}
          onPress={() => handleSocialClick('google')}
          activeOpacity={0.8}
        >
          <View style={styles.googleBadge}>
            <Text style={styles.googleText}>G</Text>
          </View>
        </TouchableOpacity>

        {/* Apple Sign-In Button */}
        <TouchableOpacity
          style={[
            styles.socialCircle,
            {
              backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
              borderColor: isDark ? '#334155' : '#F1F5F9',
            },
          ]}
          onPress={() => handleSocialClick('apple')}
          activeOpacity={0.8}
        >
          <Text style={[styles.appleText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}></Text>
        </TouchableOpacity>

        {/* Toggle between Phone and Email */}
        <TouchableOpacity
          style={[
            styles.socialCircle,
            {
              backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
              borderColor: isDark ? '#334155' : '#F1F5F9',
            },
          ]}
          onPress={() => handleSocialClick('email')}
          activeOpacity={0.8}
        >
          {isPhoneMode ? (
            <Mail size={18} color="#10B981" />
          ) : (
            <Phone size={18} color="#10B981" />
          )}
        </TouchableOpacity>
      </View>

      {/* Social Auth Modal for Gmail & Apple Account Selection */}
      <SocialAuthModal
        visible={socialModalProvider !== null}
        provider={socialModalProvider}
        onClose={() => setSocialModalProvider(null)}
        onSelectAccount={handleSelectSocialAccount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  countryBox: {
    width: 68,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  flagEmoji: {
    fontSize: 18,
  },
  inputBox: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  prefix: {
    fontSize: 15,
    fontWeight: '700',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    height: '100%',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginLeft: 4,
  },
  submitBtn: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
    marginBottom: 14,
  },
  socialCircle: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  appleText: {
    fontSize: 20,
    fontWeight: '700',
  },
});
