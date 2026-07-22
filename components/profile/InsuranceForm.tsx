import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useProfileStore } from '@/hooks/useProfileStore';
import Animated, { useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ShieldCheck, Stethoscope } from 'lucide-react-native';

interface InsuranceFormProps {
  onSuccess: () => void;
}

const getProviderColors = (providerName: string) => {
  const name = providerName.toLowerCase();
  if (name.includes('star')) return ['#EF4444', '#991B1B'] as const;
  if (name.includes('apollo')) return ['#3B82F6', '#1E3A8A'] as const;
  if (name.includes('hdfc')) return ['#EF4444', '#1E3A8A'] as const;
  if (name.includes('max')) return ['#F59E0B', '#B45309'] as const;
  if (name.includes('care')) return ['#10B981', '#064E3B'] as const;
  return ['#4B5563', '#1F2937'] as const; // default gray
};

const formatExpiry = (value: string) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  if (v.length >= 3) {
    return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
  }
  return v;
};

export default function InsuranceForm({ onSuccess }: InsuranceFormProps) {
  const { colors, isDark } = useTheme();
  const addInsurance = useProfileStore((state) => state.addInsurance);

  const [provider, setProvider] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [expiry, setExpiry] = useState('');

  // Validation
  const isExpiryValid = expiry.length === 5; // Basic length check for MM/YY
  
  const handleExpiryChange = (text: string) => {
    setExpiry(formatExpiry(text));
  };

  const handleSubmit = () => {
    if (!provider || !policyNumber || !isExpiryValid) return;
    
    addInsurance({
      provider,
      policyNumber,
      expiry
    });
    
    Keyboard.dismiss();
    onSuccess();
  };

  const gradientColors = getProviderColors(provider);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Add Health Insurance</Text>

      {/* Dynamic Virtual Policy Card */}
      <Animated.View style={styles.virtualCardContainer}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.virtualCard}
        >
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Stethoscope size={24} color="#FFF" />
              <Text style={styles.providerText}>
                {provider || 'PROVIDER NAME'}
              </Text>
            </View>
            <ShieldCheck size={28} color="rgba(255,255,255,0.2)" />
          </View>
          
          <View style={styles.cardBody}>
            <Text style={styles.cardLabel}>POLICY NUMBER</Text>
            <Text style={[styles.policyText, !policyNumber && { opacity: 0.5 }]}>
              {policyNumber || 'XXXXXXXXXX'}
            </Text>
          </View>
          
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.cardLabel}>MEMBER NAME</Text>
              <Text style={styles.cardValue}>PREMIUM USER</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.cardLabel}>VALID THRU</Text>
              <Text style={[styles.cardValue, !expiry && { opacity: 0.5 }]}>
                {expiry || 'MM/YY'}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <View style={styles.inputGroup}>
        <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}>
          <Text style={[styles.floatingLabel, { color: colors.textSecondary }]}>Provider</Text>
          <TextInput
            style={[styles.smartInput, { color: colors.text }]}
            placeholder="e.g. Star Health"
            placeholderTextColor={colors.textMuted}
            value={provider}
            onChangeText={setProvider}
          />
        </View>

        <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}>
          <Text style={[styles.floatingLabel, { color: colors.textSecondary }]}>Policy Number</Text>
          <TextInput
            style={[styles.smartInput, { color: colors.text }]}
            placeholder="XXXXXXXXXX"
            placeholderTextColor={colors.textMuted}
            value={policyNumber}
            onChangeText={setPolicyNumber}
            autoCapitalize="characters"
          />
        </View>

        <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}>
          <Text style={[styles.floatingLabel, { color: expiry && !isExpiryValid ? '#EF4444' : colors.textSecondary }]}>
            Expiry (MM/YY)
          </Text>
          <TextInput
            style={[styles.smartInput, { color: expiry && !isExpiryValid ? '#EF4444' : colors.text }]}
            placeholder="MM/YY"
            placeholderTextColor={colors.textMuted}
            value={expiry}
            onChangeText={handleExpiryChange}
            keyboardType="number-pad"
            maxLength={5}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: colors.accent, opacity: provider && policyNumber && isExpiryValid ? 1 : 0.5 }]}
        onPress={handleSubmit}
        disabled={!provider || !policyNumber || !isExpiryValid}
      >
        <Text style={styles.submitText}>Save Policy</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 20, letterSpacing: -0.5 },
  virtualCardContainer: {
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  virtualCard: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    padding: 24,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  providerText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  cardBody: {
    justifyContent: 'center',
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  policyText: {
    color: '#FFF',
    fontSize: 20,
    letterSpacing: 2,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  inputGroup: {
    gap: 16,
    marginBottom: 32,
  },
  inputWrapper: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    height: 64,
  },
  floatingLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  smartInput: { 
    height: 36, 
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: { 
    height: 60, 
    borderRadius: 30, 
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  submitText: { color: '#FFF', fontSize: 18, fontWeight: '700' }
});
