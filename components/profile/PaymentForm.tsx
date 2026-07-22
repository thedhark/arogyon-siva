import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useProfileStore } from '@/hooks/useProfileStore';
import Animated, { useAnimatedStyle, withSpring, interpolateColor, useDerivedValue, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditCard, Smartphone } from 'lucide-react-native';

interface PaymentFormProps {
  onSuccess: () => void;
}

const formatCardNumber = (value: string) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = matches && matches[0] || '';
  const parts = [];
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  if (parts.length) {
    return parts.join(' ');
  } else {
    return value;
  }
};

const getCardNetwork = (number: string) => {
  if (number.startsWith('4')) return 'visa';
  if (number.startsWith('5')) return 'mastercard';
  if (number.startsWith('3')) return 'amex';
  return 'unknown';
};

export default function PaymentForm({ onSuccess }: PaymentFormProps) {
  const { colors, isDark } = useTheme();
  const addPaymentMethod = useProfileStore((state) => state.addPaymentMethod);

  const [type, setType] = useState<'card' | 'upi'>('card');
  const [details, setDetails] = useState('');
  
  // Clean string for logic
  const rawDetails = details.replace(/\s+/g, '');
  const network = getCardNetwork(rawDetails);

  // Animation values
  const isCard = type === 'card';
  
  const handleCardChange = (text: string) => {
    setDetails(formatCardNumber(text));
  };

  const handleSubmit = () => {
    if (!details) return;
    
    addPaymentMethod({
      type,
      details: type === 'card' ? rawDetails.slice(-4) : details, // store last 4 for cards
      isPrimary: false
    });
    
    Keyboard.dismiss();
    onSuccess();
  };

  // Determine colors based on network
  const getGradientColors = () => {
    if (type === 'upi') return ['#8B5CF6', '#6D28D9'] as const;
    if (network === 'visa') return ['#3B82F6', '#1D4ED8'] as const;
    if (network === 'mastercard') return ['#F59E0B', '#B45309'] as const;
    if (network === 'amex') return ['#10B981', '#047857'] as const;
    return isDark ? ['#333333', '#111111'] as const : ['#9CA3AF', '#4B5563'] as const;
  };

  const gradientColors = getGradientColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>New Payment Method</Text>

      {/* Interactive Virtual Card */}
      <Animated.View style={styles.virtualCardContainer}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.virtualCard}
        >
          <View style={styles.cardHeader}>
            {type === 'card' ? <CreditCard size={28} color="#FFF" /> : <Smartphone size={28} color="#FFF" />}
            <Text style={styles.networkText}>
              {type === 'card' ? (network === 'unknown' ? 'CARD' : network.toUpperCase()) : 'UPI'}
            </Text>
          </View>
          
          <View style={styles.cardBody}>
            <Text style={[styles.cardNumberText, !details && { opacity: 0.5 }]}>
              {type === 'card' 
                ? (details || 'XXXX XXXX XXXX XXXX')
                : (details || 'username@bank')}
            </Text>
          </View>
          
          {type === 'card' && (
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardLabel}>CARDHOLDER</Text>
                <Text style={styles.cardValue}>PREMIUM USER</Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>EXPIRES</Text>
                <Text style={styles.cardValue}>MM/YY</Text>
              </View>
            </View>
          )}
        </LinearGradient>
      </Animated.View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, type === 'card' && { backgroundColor: colors.background }]} 
          onPress={() => { setType('card'); setDetails(''); }}
        >
          <Text style={[styles.tabText, { color: type === 'card' ? colors.text : colors.textMuted }]}>Credit Card</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, type === 'upi' && { backgroundColor: colors.background }]} 
          onPress={() => { setType('upi'); setDetails(''); }}
        >
          <Text style={[styles.tabText, { color: type === 'upi' ? colors.text : colors.textMuted }]}>UPI</Text>
        </TouchableOpacity>
      </View>

      {/* Minimalist Input */}
      <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}>
        <TextInput
          style={[styles.smartInput, { color: colors.text }]}
          placeholder={type === 'card' ? 'Card Number' : 'Enter UPI ID'}
          placeholderTextColor={colors.textMuted}
          keyboardType={type === 'card' ? 'number-pad' : 'default'}
          autoCapitalize="none"
          value={details}
          onChangeText={type === 'card' ? handleCardChange : setDetails}
          maxLength={type === 'card' ? 19 : 50}
          autoFocus
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: colors.accent, opacity: details.length > 5 ? 1 : 0.5 }]}
        onPress={handleSubmit}
        disabled={details.length <= 5}
      >
        <Text style={styles.submitText}>Save Payment Method</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 24, letterSpacing: -0.5 },
  virtualCardContainer: {
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  virtualCard: {
    width: '100%',
    height: 200,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  networkText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
    opacity: 0.9,
  },
  cardBody: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  cardNumberText: {
    color: '#FFF',
    fontSize: 22,
    letterSpacing: 3,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  tabContainer: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(0,0,0,0.05)', 
    borderRadius: 16, 
    padding: 4, 
    marginBottom: 24 
  },
  tab: { 
    flex: 1, 
    paddingVertical: 12, 
    alignItems: 'center', 
    borderRadius: 12,
  },
  tabText: { fontSize: 15, fontWeight: '700' },
  inputWrapper: {
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  smartInput: { 
    height: 60, 
    paddingHorizontal: 20, 
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  submitButton: { 
    height: 60, 
    borderRadius: 30, 
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  submitText: { color: '#FFF', fontSize: 18, fontWeight: '700' }
});
