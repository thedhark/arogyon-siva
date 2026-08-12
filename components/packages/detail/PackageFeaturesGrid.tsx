import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, ShieldCheck, Wallet, Shield } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface Props {
  isDark?: boolean;
  style?: any;
}

export const FEATURE_ITEMS = [
  {
    id: 'token',
    title: 'Reserve with\n₹499 token',
    icon: Calendar,
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    darkBgColor: '#1E293B',
  },
  {
    id: 'lock',
    title: '100% Price\nLock Guarantee',
    icon: ShieldCheck,
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    darkBgColor: '#1E293B',
  },
  {
    id: 'cashless',
    title: 'Cashless\nAvailable',
    icon: Wallet,
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    darkBgColor: '#1E293B',
  },
  {
    id: 'insurance',
    title: 'Insurance\nSupport',
    icon: Shield,
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    darkBgColor: '#1E293B',
  },
];

export default function PackageFeaturesGrid({ isDark, style }: Props) {
  const theme = useTheme();
  const activeDark = isDark ?? theme.isDark;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: activeDark ? '#1C1C1E' : '#FFFFFF',
          borderColor: activeDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
        },
        style,
      ]}
    >
      {FEATURE_ITEMS.map((item) => {
        const IconComp = item.icon;
        return (
          <View key={item.id} style={styles.featureItem}>
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: activeDark ? item.darkBgColor : item.bgColor,
                },
              ]}
            >
              <IconComp size={22} color={activeDark ? '#60A5FA' : item.color} strokeWidth={1.8} />
            </View>
            <Text
              style={[
                styles.featureTitle,
                { color: activeDark ? '#E2E8F0' : '#334155' },
              ]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 10,
    // Flat style with NO shadows/elevation per user requirement
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 10.5,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },
});
