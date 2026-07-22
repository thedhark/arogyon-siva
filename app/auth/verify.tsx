import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function VerifyScreen() {
  const { colors, isDark } = useTheme();
  const [code, setCode] = useState(['', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChangeText = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (code.every(digit => digit.length === 1)) {
      router.push('/auth/onboarding');
    }
  };

  const handleResend = () => {
    setTimer(30);
    // Add logic to resend OTP
  };

  return (
    <AnimatedScreen entrance="fade">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <LinearGradient
          colors={isDark ? ['#1A1A1A', '#121212'] : ['#F9FAFB', '#FFFFFF']}
          style={StyleSheet.absoluteFill}
        />
        
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={28} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Verify Number</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Enter the 4-digit code we sent to your phone
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(300)} style={styles.inputContainer}>
            <View style={styles.codeRow}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { inputs.current[index] = ref; }}
                  style={[
                    styles.codeInput,
                    { 
                      backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                      borderColor: digit ? colors.accent : (isDark ? '#333' : '#E0E0E0'),
                      color: colors.text
                    }
                  ]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChangeText(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  selectTextOnFocus
                />
              ))}
            </View>

            <View style={styles.resendRow}>
              <Text style={[styles.resendText, { color: colors.textSecondary }]}>
                Didn't receive code?{' '}
              </Text>
              {timer > 0 ? (
                <Text style={[styles.timerText, { color: colors.accent }]}>
                  00:{timer < 10 ? `0${timer}` : timer}
                </Text>
              ) : (
                <Pressable onPress={handleResend}>
                  <Text style={[styles.resendLink, { color: colors.accent }]}>Resend Now</Text>
                </Pressable>
              )}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(500)} style={styles.footer}>
            <Pressable 
              style={[
                styles.button, 
                { backgroundColor: code.every(d => d.length === 1) ? colors.accent : (isDark ? '#333' : '#E0E0E0') }
              ]} 
              onPress={handleVerify}
              disabled={!code.every(d => d.length === 1)}
            >
              <Text style={[
                styles.buttonText,
                { color: code.every(d => d.length === 1) ? '#FFFFFF' : (isDark ? '#888' : '#888') }
              ]}>
                Verify & Continue
              </Text>
              <ArrowRight size={20} color={code.every(d => d.length === 1) ? '#FFFFFF' : (isDark ? '#888' : '#888')} />
            </Pressable>
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
  headerRow: {
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  codeInput: {
    width: 60,
    height: 60,
    borderWidth: 1.5,
    borderRadius: 16,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 28,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  }
});
