import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { OfferCategory } from '@/constants/offers-data';

interface OfferCategoryBarProps {
  categories: OfferCategory[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export default function OfferCategoryBar({
  categories,
  activeCategoryId,
  onSelectCategory,
}: OfferCategoryBarProps) {
  const { isDark } = useTheme();

  const handleSelect = (id: string) => {
    Haptics.selectionAsync();
    onSelectCategory(id);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#161922' : '#FFFFFF',
          borderBottomColor: isDark ? '#272C3D' : '#F0F0F0',
        },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;

          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.75}
              onPress={() => handleSelect(cat.id)}
              style={styles.tabItem}
            >
              {/* Category Circle Image Container */}
              <View
                style={[
                  styles.imageWrapper,
                  {
                    backgroundColor: isDark ? '#222838' : '#F5F7FB',
                    borderColor: isActive
                      ? '#E12B38'
                      : isDark
                      ? '#2E364B'
                      : '#EBF0F7',
                  },
                ]}
              >
                <Image
                  source={cat.image}
                  style={styles.categoryImage}
                  contentFit="contain"
                />
              </View>

              {/* Category Title */}
              <Text
                style={[
                  styles.categoryTitle,
                  {
                    color: isActive
                      ? isDark
                        ? '#FFFFFF'
                        : '#0B1E48'
                      : isDark
                      ? '#8F9CAE'
                      : '#6B7280',
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
                numberOfLines={1}
              >
                {cat.name}
              </Text>

              {/* Red Active Bottom Underline Indicator */}
              <View
                style={[
                  styles.activeIndicator,
                  {
                    backgroundColor: isActive ? '#E12B38' : 'transparent',
                  },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 12,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 18,
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 68,
    paddingBottom: 6,
  },
  imageWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  categoryImage: {
    width: 38,
    height: 38,
  },
  categoryTitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  activeIndicator: {
    height: 3,
    width: '80%',
    borderRadius: 1.5,
  },
});
