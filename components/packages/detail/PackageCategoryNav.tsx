import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CreditCard, BadgePercent, ShieldCheck, Landmark, Briefcase } from 'lucide-react-native';

interface Props {
  selectedCategory?: string;
  onSelectCategory?: (id: string) => void;
  isDark: boolean;
  colors: any;
}

export const BENEFIT_TAG_ITEMS = [
  { id: 'cashless', label: 'Cashless', icon: CreditCard },
  { id: 'emi', label: '0% EMI', icon: BadgePercent },
  { id: 'insurance', label: 'Insurance', icon: ShieldCheck },
  { id: 'govt', label: 'Govt Schemes', icon: Landmark },
  { id: 'corporate', label: 'Corporate', icon: Briefcase },
];

export default function PackageCategoryNav({
  selectedCategory = 'cashless',
  onSelectCategory,
  isDark,
  colors,
}: Props) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {BENEFIT_TAG_ITEMS.map((item) => {
          const IconComp = item.icon;
          const isSelected = selectedCategory === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => onSelectCategory?.(item.id)}
              style={styles.itemWrapper}
            >
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: isSelected
                      ? (isDark ? '#4C1D95' : '#EDE9FE')
                      : (isDark ? '#1F192E' : '#F5F3FF'),
                    borderColor: isSelected ? '#7C3AED' : 'transparent',
                    borderWidth: isSelected ? 1.5 : 0,
                  },
                ]}
              >
                <IconComp size={20} color={isSelected ? '#6527BE' : '#7C3AED'} />
              </View>
              <Text
                style={[
                  styles.label,
                  {
                    color: isSelected
                      ? (isDark ? '#DDD6FE' : '#6527BE')
                      : (isDark ? '#D1D5DB' : colors.text),
                    fontWeight: isSelected ? '700' : '600',
                  },
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: -16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  itemWrapper: {
    alignItems: 'center',
    width: 64,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 13,
  },
});
