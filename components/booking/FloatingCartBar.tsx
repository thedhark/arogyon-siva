import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Percent } from 'lucide-react-native';
import { useBookingStore } from '@/hooks/useBookingStore';
import { useTheme } from '@/hooks/useTheme';

interface FloatingCartBarProps {
  onPressContinue?: () => void;
  bottomOffset?: number;
}

export default function FloatingCartBar({ onPressContinue, bottomOffset = 20 }: FloatingCartBarProps) {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const cartItems = useBookingStore(state => state.cartItems);
  const getCartSavings = useBookingStore(state => state.getCartSavings);

  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  const latestItem = cartItems[0];
  const totalSavings = getCartSavings();
  const savingsText = totalSavings > 0 
    ? (cartItems.length === 1 
        ? `Free delivery unlocked & ₹${totalSavings} saved on ${latestItem.title}` 
        : `You are saving ₹${totalSavings} on ${latestItem.title}`)
    : `${cartItems.length} item${cartItems.length > 1 ? 's' : ''} reserved in your cart`;

  const handleContinue = () => {
    if (onPressContinue) {
      onPressContinue();
    } else {
      router.push('/booking/checkout');
    }
  };

  // Limit display to max 3 overlapping avatars
  const avatarItems = cartItems.slice(0, 3);

  return (
    <View style={[styles.wrapper, { bottom: bottomOffset }]}>
      {/* Top Benefit / Savings Summary Banner */}
      <View style={[styles.savingsBanner, { backgroundColor: isDark ? '#1E293B' : '#EBF5FF', borderColor: isDark ? '#334155' : '#DBEAFE' }]}>
        <View style={styles.badgeContainer}>
          <View style={styles.percentBadge}>
            <Percent size={13} color="#FFFFFF" strokeWidth={3} />
          </View>
        </View>
        <Text style={[styles.savingsText, { color: isDark ? '#38BDF8' : '#1D4ED8' }]} numberOfLines={1}>
          {savingsText}
        </Text>
      </View>

      {/* Main Crimson Red Floating Bar */}
      <TouchableOpacity 
        style={styles.redCartBar}
        onPress={handleContinue}
        activeOpacity={0.9}
      >
        <View style={styles.leftSection}>
          {/* Overlapping Avatar Group */}
          <View style={styles.avatarGroup}>
            {avatarItems.map((item, index) => (
              <View 
                key={item.id} 
                style={[
                  styles.avatarWrapper, 
                  { 
                    marginLeft: index === 0 ? 0 : -14,
                    zIndex: 10 - index,
                  }
                ]}
              >
                <Image 
                  source={{ uri: item.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200' }} 
                  style={styles.avatarImage} 
                />
              </View>
            ))}
          </View>

          <Text style={styles.itemCountText}>
            {cartItems.length} {cartItems.length === 1 ? 'item added' : 'items added'}
          </Text>
        </View>

        {/* Right CTA Section */}
        <View style={styles.rightSection}>
          <Text style={styles.continueText}>Continue</Text>
          <ChevronRight size={18} color="#FFFFFF" strokeWidth={2.5} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 14,
    right: 14,
    zIndex: 999,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  savingsBanner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    borderBottomWidth: 0,
    gap: 10,
  },
  badgeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savingsText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  redCartBar: {
    width: '100%',
    height: 58,
    backgroundColor: '#EE4358', // Vibrant Swiggy/Zomato Red
    borderRadius: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 19,
  },
  itemCountText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
