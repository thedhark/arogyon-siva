import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Search, MapPin, ShieldCheck, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';

interface LabHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
}

export default function LabHeader({ searchQuery, onSearchChange, onClearSearch }: LabHeaderProps) {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121214' : '#FFFFFF' }]}>
      {/* Navigation & Title Row */}
      <View style={styles.topRow}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]} onPress={handleBack} activeOpacity={0.7}>
          <ChevronLeft size={22} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <View style={styles.titleBadgeRow}>
            <Text style={[styles.screenTitle, { color: colors.text }]}>Arogyon Labs</Text>
            <View style={styles.nablBadge}>
              <ShieldCheck size={12} color="#10B981" />
              <Text style={styles.nablText}>NABL Accredited</Text>
            </View>
          </View>
          <View style={styles.locationRow}>
            <MapPin size={12} color="#6B7280" />
            <Text style={styles.locationText}>Home Collection in Bengaluru</Text>
          </View>
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={[styles.searchBar, { backgroundColor: isDark ? '#1F1F23' : '#F3F4F6', borderColor: isDark ? '#27272A' : '#E5E7EB' }]}>
        <Search size={18} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.searchIcon} />
        <TextInput
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search blood tests, packages, labs..."
          placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
          style={[styles.searchInput, { color: colors.text }]}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={onClearSearch} style={styles.clearBtn}>
            <X size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  screenTitle: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  nablBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  nablText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
});
