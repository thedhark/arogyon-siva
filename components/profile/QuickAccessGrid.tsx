import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Users, FileText, MapPin, Bookmark, ShieldCheck, CreditCard, Bell } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

import { useRouter } from 'expo-router';

const QUICK_ACTIONS = [
  { id: '1', title: 'Bookings', route: '/appointments', icon: Calendar, color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
  { id: '2', title: 'Family Members', route: '/profile/family', icon: Users, color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)' },
  { id: '3', title: 'Health Records', route: '/profile/records', icon: FileText, color: '#8B5CF6', bgColor: 'rgba(139, 92, 246, 0.1)' },
  { id: '4', title: 'Location', route: '/location', icon: MapPin, color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
  { id: '5', title: 'Saved', route: '/profile/saved', icon: Bookmark, color: '#EC4899', bgColor: 'rgba(236, 72, 153, 0.1)' },
  { id: '6', title: 'Insurance', route: '/profile/insurance', icon: ShieldCheck, color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
  { id: '7', title: 'Payments', route: '/profile/payments', icon: CreditCard, color: '#6366F1', bgColor: 'rgba(99, 102, 241, 0.1)' },
  { id: '8', title: 'Reminders', route: '/profile/reminders', icon: Bell, color: '#06B6D4', bgColor: 'rgba(6, 182, 212, 0.1)' },
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
