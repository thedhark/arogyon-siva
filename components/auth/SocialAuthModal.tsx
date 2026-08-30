import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { X, Check, ShieldCheck, Mail } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export interface SocialUserOption {
  name: string;
  email: string;
  avatar: string;
}

interface SocialAuthModalProps {
  visible: boolean;
  provider: 'google' | 'apple' | null;
  onClose: () => void;
  onSelectAccount: (user: SocialUserOption) => Promise<void>;
}

const GOOGLE_ACCOUNTS: SocialUserOption[] = [
  {
    name: 'Sridhar Kandala',
    email: 'sridhar.kandala@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
  },
  {
    name: 'Arogyon Health',
    email: 'arogyon.user@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200',
  },
];

const APPLE_ACCOUNT: SocialUserOption = {
  name: 'Sridhar K.',
  email: 'sridhar.apple@privaterelay.appleid.com',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
};

export default function SocialAuthModal({
  visible,
  provider,
  onClose,
  onSelectAccount,
}: SocialAuthModalProps) {
  const { colors, isDark } = useTheme();
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!provider) return null;

  const isGoogle = provider === 'google';

  const handleAccountSelect = async (account: SocialUserOption) => {
    setSelectedEmail(account.email);
    setIsProcessing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    await onSelectAccount(account);
    setIsProcessing(false);
    setSelectedEmail(null);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View
          style={[
            styles.card,
            {
              backgroundColor: isDark ? '#18222C' : '#FFFFFF',
              borderColor: isDark ? '#2B3846' : '#E2E8F0',
            },
          ]}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.providerBadgeRow}>
              {isGoogle ? (
                <View style={styles.googleBadge}>
                  <Text style={styles.googleBadgeText}>G</Text>
                </View>
              ) : (
                <Text style={[styles.appleBadgeText, { color: isDark ? '#FFFFFF' : '#000000' }]}></Text>
              )}
              <Text style={[styles.title, { color: colors.text }]}>
                {isGoogle ? 'Sign in with Google' : 'Sign in with Apple'}
              </Text>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn} disabled={isProcessing}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {isGoogle
              ? 'Choose a Gmail account to continue to Arogyon'
              : 'Use your Apple ID to sign in securely'}
          </Text>

          {/* Account Choices */}
          <View style={styles.accountsList}>
            {isGoogle ? (
              GOOGLE_ACCOUNTS.map((acc) => {
                const isSelected = selectedEmail === acc.email;
                return (
                  <TouchableOpacity
                    key={acc.email}
                    style={[
                      styles.accountItem,
                      {
                        backgroundColor: isDark ? '#1F2C39' : '#F8FAFC',
                        borderColor: isSelected ? '#10B981' : (isDark ? '#2C3E50' : '#EDF2F7'),
                      },
                    ]}
                    onPress={() => handleAccountSelect(acc)}
                    disabled={isProcessing}
                    activeOpacity={0.7}
                  >
                    <Image source={{ uri: acc.avatar }} style={styles.avatar} />
                    <View style={styles.accountInfo}>
                      <Text style={[styles.accName, { color: colors.text }]}>{acc.name}</Text>
                      <Text style={[styles.accEmail, { color: colors.textSecondary }]}>{acc.email}</Text>
                    </View>
                    {isProcessing && isSelected ? (
                      <ActivityIndicator size="small" color="#10B981" />
                    ) : isSelected ? (
                      <Check size={18} color="#10B981" />
                    ) : null}
                  </TouchableOpacity>
                );
              })
            ) : (
              <TouchableOpacity
                style={[
                  styles.accountItem,
                  {
                    backgroundColor: isDark ? '#1F2C39' : '#F8FAFC',
                    borderColor: selectedEmail === APPLE_ACCOUNT.email ? '#10B981' : (isDark ? '#2C3E50' : '#EDF2F7'),
                  },
                ]}
                onPress={() => handleAccountSelect(APPLE_ACCOUNT)}
                disabled={isProcessing}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.appleIconPlaceholder,
                    { backgroundColor: isDark ? '#000000' : '#1E293B' },
                  ]}
                >
                  <Text style={styles.appleIconPlaceholderText}></Text>
                </View>
                <View style={styles.accountInfo}>
                  <Text style={[styles.accName, { color: colors.text }]}>Apple ID</Text>
                  <Text style={[styles.accEmail, { color: colors.textSecondary }]}>
                    {APPLE_ACCOUNT.email}
                  </Text>
                </View>
                {isProcessing ? (
                  <ActivityIndicator size="small" color="#10B981" />
                ) : (
                  <ShieldCheck size={18} color="#10B981" />
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Privacy Note */}
          <View style={styles.footerRow}>
            <ShieldCheck size={14} color="#10B981" style={{ marginRight: 6 }} />
            <Text style={[styles.privacyNote, { color: colors.textSecondary }]}>
              Secure encrypted sign-in via Arogyon ID
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  providerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  googleBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  appleBadgeText: {
    fontSize: 24,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 13.5,
    marginBottom: 18,
  },
  accountsList: {
    gap: 10,
    marginBottom: 16,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  appleIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  appleIconPlaceholderText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  accountInfo: {
    flex: 1,
  },
  accName: {
    fontSize: 14.5,
    fontWeight: '600',
  },
  accEmail: {
    fontSize: 12.5,
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  privacyNote: {
    fontSize: 12,
  },
});
