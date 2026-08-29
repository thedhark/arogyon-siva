import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import { BlurView } from 'expo-blur';

interface PaymentProcessingModalProps {
  visible: boolean;
  amount: string;
  paymentMethod: string;
  onSuccess: () => void;
  onFailure?: (reason: string) => void;
}

const STEPS = [
  'Connecting to Banking Network...',
  'Verifying Secure Transaction Token...',
  'Confirming Appointment with Hospital...',
];

export default function PaymentProcessingModal({
  visible,
  amount,
  paymentMethod,
  onSuccess,
  onFailure,
}: PaymentProcessingModalProps) {
  const { colors, isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (!visible) {
      setCurrentStep(0);
      return;
    }

    // Pulse animation for security shield
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Step 1: 0 - 800ms
    const timer1 = setTimeout(() => {
      setCurrentStep(1);
    }, 900);

    // Step 2: 800ms - 1800ms
    const timer2 = setTimeout(() => {
      setCurrentStep(2);
    }, 1800);

    // Step 3 (Success completion): 2400ms
    const timer3 = setTimeout(() => {
      onSuccess();
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={70} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        ) : (
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(15, 23, 42, 0.65)' },
            ]}
          />
        )}

        <View
          style={[
            styles.card,
            {
              backgroundColor: isDark ? '#1C1F28' : '#FFFFFF',
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
            },
          ]}
        >
          {/* Pulsing Security Shield */}
          <Animated.View style={[styles.shieldContainer, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.shieldHalo}>
              <ShieldCheck size={38} color="#00A981" strokeWidth={2.4} />
            </View>
          </Animated.View>

          <Text style={[styles.title, { color: colors.text }]}>Processing Payment</Text>
          <Text style={[styles.amountText, { color: '#00A981' }]}>₹{amount}</Text>
          <Text style={[styles.methodText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            Via {paymentMethod}
          </Text>

          {/* Stepper Progress */}
          <View style={styles.stepperContainer}>
            {STEPS.map((step, idx) => {
              const isDone = currentStep > idx;
              const isCurrent = currentStep === idx;

              return (
                <View key={idx} style={styles.stepRow}>
                  <View
                    style={[
                      styles.stepIndicator,
                      isDone
                        ? styles.stepDone
                        : isCurrent
                        ? styles.stepActive
                        : styles.stepPending,
                    ]}
                  >
                    {isDone ? (
                      <CheckCircle2 size={14} color="#FFFFFF" />
                    ) : isCurrent ? (
                      <ActivityIndicator size="small" color="#00A981" />
                    ) : (
                      <View style={styles.pendingDot} />
                    )}
                  </View>

                  <Text
                    style={[
                      styles.stepText,
                      {
                        color: isDone
                          ? isDark
                            ? '#34D399'
                            : '#059669'
                          : isCurrent
                          ? colors.text
                          : isDark
                          ? '#64748B'
                          : '#94A3B8',
                        fontWeight: isCurrent ? '700' : '500',
                      },
                    ]}
                  >
                    {step}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Bottom Security Assurance */}
          <View style={styles.securityFooter}>
            <Lock size={12} color={isDark ? '#94A3B8' : '#64748B'} />
            <Text style={[styles.securityText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              256-bit SSL • NPCI & RBI Certified
            </Text>
          </View>

          <Text style={[styles.warningText, { color: isDark ? '#94A3B8' : '#94A3B8' }]}>
            Please do not press back or close the app
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  shieldContainer: {
    marginBottom: 14,
  },
  shieldHalo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0, 169, 129, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 4,
  },
  amountText: {
    fontFamily: Fonts.bold,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  methodText: {
    fontFamily: Fonts.medium,
    fontSize: 12.5,
    marginBottom: 20,
  },
  stepperContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: 14,
    borderRadius: 14,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDone: {
    backgroundColor: '#00A981',
  },
  stepActive: {
    backgroundColor: 'rgba(0, 169, 129, 0.15)',
  },
  stepPending: {
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
  },
  pendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94A3B8',
  },
  stepText: {
    fontFamily: Fonts.regular,
    fontSize: 12.5,
    flex: 1,
  },
  securityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  securityText: {
    fontFamily: Fonts.medium,
    fontSize: 11,
  },
  warningText: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    textAlign: 'center',
  },
});
