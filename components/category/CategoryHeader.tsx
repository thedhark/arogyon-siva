import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ArrowLeft, MapPin, ChevronDown, Heart, Share2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface Props {
  title: string;
  subtitle: string;
  icon: string;
  location?: string;
  onPressLocation?: () => void;
  isDark: boolean;
  colors: any;
}

export default function CategoryHeader({
  title,
  subtitle,
  icon,
  location = 'Bengaluru, Karnataka',
  onPressLocation,
  isDark,
  colors,
}: Props) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {/* Navigation Top Row: Back Button + Location Bar */}
      <View style={styles.topNavigationRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.locationSelector} 
          onPress={onPressLocation} 
          activeOpacity={0.7}
        >
          <MapPin size={15} color="#6366F1" />
          <Text style={[styles.locationText, { color: colors.text }]} numberOfLines={1}>
            {location}
          </Text>
          <ChevronDown size={15} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Hero Category Banner Content */}
      <View style={styles.headerContent}>
        <View style={styles.iconContainer}>
          <Image source={{ uri: icon }} style={styles.categoryIcon} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              { backgroundColor: isDark ? '#2A2A2A' : '#F9FAFB', borderColor: isDark ? '#333' : '#F3F4F6' }
            ]}
          >
            <Heart size={18} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              { backgroundColor: isDark ? '#2A2A2A' : '#F9FAFB', borderColor: isDark ? '#333' : '#F3F4F6' }
            ]}
          >
            <Share2 size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  topNavigationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '700',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 14,
    overflow: 'hidden',
  },
  categoryIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
