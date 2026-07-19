import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShoppingBag, FileText, ClipboardList, Heart, FileCode2, ShieldAlert, CreditCard, Bell } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

import { useRouter } from 'expo-router';

const QUICK_ACTIONS = [
  { id: '1', title: 'My Orders', route: '/profile/orders', icon: ShoppingBag, color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
  { id: '2', title: 'Prescriptions', route: '/profile/prescriptions', icon: FileText, color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
  { id: '3', title: 'Reports', route: '/profile/reports', icon: ClipboardList, color: '#8B5CF6', bgColor: 'rgba(139, 92, 246, 0.1)' },
  { id: '4', title: 'Saved', route: '/profile/saved', icon: Heart, color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.1)' },
  { id: '5', title: 'Health Records', route: '/profile/records', icon: FileCode2, color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
  { id: '6', title: 'Insurance', route: '/profile/insurance', icon: ShieldAlert, color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
  { id: '7', title: 'Payment Methods', route: '/profile/payments', icon: CreditCard, color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
  { id: '8', title: 'Reminders', route: '/profile/reminders', icon: Bell, color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
];

export default function QuickAccessGrid() {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Quick Access</Text>
      
      <View style={styles.grid}>
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity 
            key={action.id} 
            onPress={() => router.push(action.route as any)}
            style={[styles.actionBtn, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}
          >
            <View style={[styles.iconWrapper, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : action.bgColor }]}>
              <action.icon size={22} color={action.color} />
            </View>
            <Text style={[styles.actionTitle, { color: colors.text }]} numberOfLines={2}>
              {action.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionBtn: {
    width: '22%', // Roughly 4 columns
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 20,
    minHeight: 100,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  }
});
