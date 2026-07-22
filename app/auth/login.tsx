import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Phone, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const { colors, isDark } = useTheme();
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleContinue = () => {
    if (phoneNumber.length >= 10) {
      router.push('/auth/verify');
    }
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
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Welcome to Arogyon</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Enter your phone number to get started</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(300)} style={styles.inputContainer}>
            <View style={[
              styles.inputWrapper, 
              { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' }
            ]}>
              <View style={styles.countryCode}>
                <Text style={[styles.countryCodeText, { color: colors.text }]}>+91</Text>
              </View>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Mobile Number"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                maxLength={10}
              />
              <Phone size={20} color={colors.accent} style={styles.inputIcon} />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(500)} style={styles.footer}>
            <Text style={[styles.termsText, { color: colors.textSecondary }]}>
              By continuing, you agree to our Terms of Service & Privacy Policy
            </Text>
            <Pressable 
              style={[
                styles.button, 
                { backgroundColor: phoneNumber.length >= 10 ? colors.accent : (isDark ? '#333' : '#E0E0E0') }
              ]} 
              onPress={handleContinue}
              disabled={phoneNumber.length < 10}
            >
              <Text style={[
                styles.buttonText,
                { color: phoneNumber.length >= 10 ? '#FFFFFF' : (isDark ? '#888' : '#888') }
              ]}>
                Continue
              </Text>
              <ChevronRight size={20} color={phoneNumber.length >= 10 ? '#FFFFFF' : (isDark ? '#888' : '#888')} />
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
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 60,
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  countryCode: {
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    paddingRight: 12,
    marginRight: 12,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  inputIcon: {
    marginLeft: 12,
  },
  footer: {
    marginBottom: 40,
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
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
