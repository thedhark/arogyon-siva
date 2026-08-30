import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CalendarCheck, ShieldCheck, Wallet, Stethoscope } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface Props {
  isDark?: boolean;
  style?: any;
}

export const FEATURE_ITEMS = [
  {
    id: 'token',
    title: 'Reserve with\n₹499 token',
    icon: CalendarCheck,
    color: '#0D9488',
    bgColor: '#ECFDF5',
    darkBgColor: 'rgba(16, 185, 129, 0.15)',
  },
  {
    id: 'lock',
    title: '100% Price\nLock Guarantee',
    icon: ShieldCheck,
    color: '#0D9488',
    bgColor: '#ECFDF5',
    darkBgColor: 'rgba(16, 185, 129, 0.15)',
  },
  {
    id: 'cashless',
    title: 'Cashless\nAvailable',
    icon: Wallet,
    color: '#0D9488',
    bgColor: '#ECFDF5',
    darkBgColor: 'rgba(16, 185, 129, 0.15)',
  },
  {
    id: 'consultation',
    title: 'Specialist\nConsultation',
    icon: Stethoscope,
    color: '#0D9488',
    bgColor: '#ECFDF5',
    darkBgColor: 'rgba(16, 185, 129, 0.15)',
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
          backgroundColor: activeDark ? '#1E293B' : '#FFFFFF',
          borderColor: activeDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
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
              <IconComp size={22} color={activeDark ? '#34D399' : item.color} strokeWidth={1.8} />
            </View>
            <Text
              style={[
                styles.featureTitle,
                { color: activeDark ? '#F1F5F9' : '#334155' },
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
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 18,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  featureTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 14,
  },
});
