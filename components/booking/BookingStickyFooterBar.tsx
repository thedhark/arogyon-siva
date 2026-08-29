import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { RotateCcw, Download } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';

interface Props {
  onReorderPress?: () => void;
  onInvoicePress?: () => void;
}

export default function BookingStickyFooterBar({
  onReorderPress,
  onInvoicePress,
}: Props) {
  const { isDark } = useTheme();

  const handleReorder = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onReorderPress?.();
  };

  const handleInvoice = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onInvoicePress?.();
  };

  return (
    <View
      style={[
        styles.footerContainer,
        {
          backgroundColor: isDark ? '#18181B' : '#FFFFFF',
          borderTopColor: isDark ? '#27272A' : '#F1F5F9',
        },
      ]}
    >
      {/* Red/Coral Reorder Button */}
      <TouchableOpacity
        style={styles.reorderBtn}
        onPress={handleReorder}
        activeOpacity={0.85}
      >
        <RotateCcw size={18} color="#FFFFFF" strokeWidth={2.4} />
        <Text style={styles.reorderBtnText}>Reorder</Text>
      </TouchableOpacity>

      {/* White Outlined Invoice Button */}
      <TouchableOpacity
        style={[
          styles.invoiceBtn,
          {
            borderColor: '#E11D48',
            backgroundColor: isDark ? '#27272A' : '#FFFFFF',
          },
        ]}
        onPress={handleInvoice}
        activeOpacity={0.85}
      >
        <Download size={18} color="#E11D48" strokeWidth={2.4} />
        <Text style={styles.invoiceBtnText}>Invoice</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  reorderBtn: {
    flex: 1,
    height: 48,
    backgroundColor: '#E11D48',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  reorderBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  invoiceBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  invoiceBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: '#E11D48',
    fontWeight: '700',
  },
});
