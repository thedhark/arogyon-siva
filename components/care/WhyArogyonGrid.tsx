import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

export interface WhyItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
}

interface WhyArogyonGridProps {
  isDark: boolean;
  sectionTitle: string;
  items: WhyItem[];
}

export default function WhyArogyonGrid({
  isDark,
  sectionTitle,
  items,
}: WhyArogyonGridProps) {
  const titleColor = isDark ? '#F8FAFC' : '#0F2936';
  const cardBg = isDark ? '#111827' : '#FFFFFF';
  const cardBorder = isDark ? '#1F2937' : '#EEF2F6';
  const itemTitleColor = isDark ? '#F8FAFC' : '#0F2936';
  const itemSubColor = isDark ? '#94A3B8' : '#64748B';

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: titleColor }]}>{sectionTitle}</Text>

      <View style={styles.gridContainer}>
        {items.map((item) => {
          const IconComponent = item.icon;
          const bg = item.iconBg || (isDark ? '#1E293B' : '#E0F2FE');
          const color = item.iconColor || (isDark ? '#38BDF8' : '#0284C7');

          return (
            <View
              key={item.id}
              style={[styles.cardItem, { backgroundColor: cardBg, borderColor: cardBorder }]}
            >
              <View style={[styles.iconContainer, { backgroundColor: bg }]}>
                <IconComponent size={20} color={color} />
              </View>
              <Text style={[styles.itemTitle, { color: itemTitleColor }]} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={[styles.itemDescription, { color: itemSubColor }]}>
                {item.description}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    gap: 8,
  },
  cardItem: {
    width: '48.5%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    minHeight: 125,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 16,
  },
  itemDescription: {
    fontSize: 11,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 14,
  },
});
