import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/hooks/useAuthStore';
import AnimatedScreen from '@/components/AnimatedScreen';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export default function VerifyScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { identifier, authMode, verifyOtp, sendOtp, isLoading, error } = useAuthStore();

  const [code, setCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChangeText = async (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }

    // Auto submit on 4th digit
    if (newCode.every((digit) => digit.length === 1)) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const fullCode = newCode.join('');
      const res = await verifyOtp(fullCode);
      if (res.success) {
        if (res.isNewUser) {
          router.replace('/auth/onboarding');
        } else {
          router.replace('/(tabs)');
        }
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleManualVerify = async () => {
    if (code.every((digit) => digit.length === 1)) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const res = await verifyOtp(code.join(''));
      if (res.success) {
        if (res.isNewUser) {
          router.replace('/auth/onboarding');
        } else {
          router.replace('/(tabs)');
        }
      }
    }
  };

  const handleResend = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimer(30);
    setCode(['', '', '', '']);
    inputs.current[0]?.focus();
    await sendOtp();
  };

  const displayTarget = identifier || (authMode === 'phone' ? '+91 ••••• •••••' : 'your email');
  const isFilled = code.every((d) => d.length === 1);

  return (
    <AnimatedScreen entrance="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: isDark ? '#0C1319' : '#FFFFFF' }]}
      >
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={26} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(100)} style={styles.titleArea}>
            <Text style={[styles.title, { color: colors.text }]}>
              {authMode === 'phone' ? 'Verify Mobile' : 'Verify Email'}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Enter the 4-digit code sent to {displayTarget}
            </Text>
          </Animated.View>

          {/* 4 Digit Boxes */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.codeArea}>
            <View style={styles.codeRow}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputs.current[index] = ref;
                  }}
                  style={[
                    styles.digitBox,
                    {
                      backgroundColor: isDark ? '#16202A' : '#F8FAFC',
                      borderColor: digit ? '#10B981' : (isDark ? '#2D3748' : '#E2E8F0'),
                      color: colors.text,
                    },
                  ]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(t) => handleChangeText(t, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  selectTextOnFocus
                />
              ))}
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Resend Timer */}
            <View style={styles.resendRow}>
              <Text style={[styles.resendLabel, { color: colors.textSecondary }]}>
                Didn't receive code?{' '}
              </Text>
              {timer > 0 ? (
                <Text style={[styles.timerText, { color: '#10B981' }]}>
                  00:{timer < 10 ? `0${timer}` : timer}
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendActiveText}>Resend Now</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>

          {/* Action Button */}
          <Animated.View entering={FadeInUp.delay(300)} style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.submitBtn,
                {
                  backgroundColor: isFilled
                    ? '#10B981'
                    : (isDark ? 'rgba(16, 185, 129, 0.3)' : '#A7F3D0'),
                },
              ]}
              onPress={handleManualVerify}
              disabled={!isFilled || isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.btnText}>Verify & Continue</Text>
                  <ArrowRight size={18} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    paddingTop: Platform.OS === 'ios' ? 52 : 36,
    paddingHorizontal: 16,
    height: 90,
    justifyContent: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  titleArea: {
    marginTop: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14.5,
    lineHeight: 22,
  },
  codeArea: {
    alignItems: 'center',
    marginVertical: 'auto',
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  digitBox: {
    width: 56,
    height: 56,
    borderWidth: 1.5,
    borderRadius: 14,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  resendLabel: {
    fontSize: 13.5,
  },
  timerText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  resendActiveText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#10B981',
  },
  footer: {
    width: '100%',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 14,
    gap: 8,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
  },
});
