import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { User, Calendar, Check, ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { useProfileStore } from '@/hooks/useProfileStore';

export default function OnboardingScreen() {
  const { colors, isDark } = useTheme();
  const updateUserProfile = useProfileStore((state) => state.updateUserProfile);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<string | null>(null);

  const handleComplete = () => {
    if (name && age && gender) {
      updateUserProfile({
        name,
        age: parseInt(age, 10) || 28,
        gender: gender as any,
      });
      router.replace('/(tabs)');
    }
  };

  const isFormValid = name.length > 0 && age.length > 0 && gender !== null;

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
        
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
            <View style={styles.freeImageWrapper}>
              <Image
                source={require('@/assets/images/onboarding_hands.png')}
                style={styles.freeOnboardingImage}
                resizeMode="cover"
              />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Let's get to know you</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Help us personalize your healthcare experience
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(300)} style={styles.formContainer}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
              <View style={[
                styles.inputWrapper, 
                { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' }
              ]}>
                <User size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="e.g. John Doe"
                  placeholderTextColor={colors.textSecondary}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* Age */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Age</Text>
              <View style={[
                styles.inputWrapper, 
                { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' }
              ]}>
                <Calendar size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="e.g. 28"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  maxLength={3}
                  value={age}
                  onChangeText={setAge}
                />
              </View>
            </View>

            {/* Gender Selection */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Gender</Text>
              <View style={styles.genderRow}>
                {['Male', 'Female', 'Other'].map((g) => (
                  <Pressable
                    key={g}
                    style={[
                      styles.genderButton,
                      { 
                        backgroundColor: gender === g ? colors.accent + '15' : (isDark ? '#1E1E1E' : '#FFFFFF'),
                        borderColor: gender === g ? colors.accent : (isDark ? '#333' : '#F0F0F0')
                      }
                    ]}
                    onPress={() => setGender(g)}
                  >
                    <Text style={[
                      styles.genderText,
                      { color: gender === g ? colors.accent : colors.textSecondary }
                    ]}>
                      {g}
                    </Text>
                    {gender === g && (
                      <Check size={16} color={colors.accent} style={styles.checkIcon} />
                    )}
                  </Pressable>
                ))}
              </View>
            </View>

          </Animated.View>
        </ScrollView>

        <Animated.View entering={FadeInUp.delay(500)} style={styles.footer}>
          <Pressable 
            style={[
              styles.button, 
              { backgroundColor: isFormValid ? colors.accent : (isDark ? '#333' : '#E0E0E0') }
            ]} 
            onPress={handleComplete}
            disabled={!isFormValid}
          >
            <Text style={[
              styles.buttonText,
              { color: isFormValid ? '#FFFFFF' : (isDark ? '#888' : '#888') }
            ]}>
              Complete Profile
            </Text>
            <ArrowRight size={20} color={isFormValid ? '#FFFFFF' : (isDark ? '#888' : '#888')} />
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  formContainer: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderWidth: 1,
    borderRadius: 16,
  },
  genderText: {
    fontSize: 15,
    fontWeight: '500',
  },
  checkIcon: {
    marginLeft: 6,
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
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
  },
  freeImageWrapper: {
    width: '100%',
    height: 180,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  freeOnboardingImage: {
    width: '100%',
    height: '100%',
  },
});
