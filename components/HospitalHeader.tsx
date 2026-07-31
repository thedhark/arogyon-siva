import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { ChevronLeft, Search, MoreVertical } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';

interface HospitalHeaderProps {
  onBackPress: () => void;
  onSearchChange?: (text: string) => void;
  onMorePress?: () => void;
  isDark?: boolean;
}

export default function HospitalHeader({
  onBackPress,
  onSearchChange,
  onMorePress,
  isDark = true,
}: HospitalHeaderProps) {
  const insets = useSafeAreaInsets();
  const supportsLiquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable && isLiquidGlassAvailable();
  const [searchQuery, setSearchQuery] = useState('');

  const handleTextChange = (text: string) => {
    setSearchQuery(text);
    if (onSearchChange) onSearchChange(text);
  };

  const glassBg = 'rgba(0, 0, 0, 0.12)';
  const borderCol = 'rgba(255, 255, 255, 0.32)';
  const iconCol = '#FFFFFF';
  const placeholderCol = 'rgba(255, 255, 255, 0.8)';

  const topInset = Math.max(insets.top + (Platform.OS === 'ios' ? 4 : 8), 36);

  return (
    <View style={[styles.headerContainer, { top: topInset }]}>
      {/* Transparent Circular Back Button */}
      <TouchableOpacity
        onPress={onBackPress}
        style={styles.circleBtnWrapper}
        activeOpacity={0.8}
      >
        <View style={[styles.circleBtn, { backgroundColor: glassBg, borderColor: borderCol }]}>
          {supportsLiquidGlass ? (
            <GlassView glassEffectStyle="regular" isInteractive={true} style={[StyleSheet.absoluteFill, { borderRadius: 19, overflow: 'hidden' }]} />
          ) : Platform.OS === 'ios' ? (
            <BlurView intensity={25} tint="dark" style={[StyleSheet.absoluteFill, { borderRadius: 19, overflow: 'hidden' }]} />
          ) : null}
          <ChevronLeft color={iconCol} size={20} strokeWidth={2.2} />
        </View>
      </TouchableOpacity>

      {/* Right Action Group */}
      <View style={styles.rightGroup}>
        {/* Transparent Search Capsule */}
        <View style={[styles.searchCapsule, { backgroundColor: glassBg, borderColor: borderCol }]}>
          {supportsLiquidGlass ? (
            <GlassView glassEffectStyle="regular" isInteractive={true} style={[StyleSheet.absoluteFill, { borderRadius: 19, overflow: 'hidden' }]} />
          ) : Platform.OS === 'ios' ? (
            <BlurView intensity={25} tint="dark" style={[StyleSheet.absoluteFill, { borderRadius: 19, overflow: 'hidden' }]} />
          ) : null}

          <Search size={15} color={iconCol} strokeWidth={2.2} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: iconCol }]}
            placeholder="Search"
            placeholderTextColor={placeholderCol}
            value={searchQuery}
            onChangeText={handleTextChange}
          />
        </View>

        {/* Transparent Circular Options Button */}
        <TouchableOpacity
          onPress={onMorePress}
          style={styles.circleBtnWrapper}
          activeOpacity={0.8}
        >
          <View style={[styles.circleBtn, { backgroundColor: glassBg, borderColor: borderCol }]}>
            {supportsLiquidGlass ? (
              <GlassView glassEffectStyle="regular" isInteractive={true} style={[StyleSheet.absoluteFill, { borderRadius: 19, overflow: 'hidden' }]} />
            ) : Platform.OS === 'ios' ? (
              <BlurView intensity={25} tint="dark" style={[StyleSheet.absoluteFill, { borderRadius: 19, overflow: 'hidden' }]} />
            ) : null}
            <MoreVertical color={iconCol} size={18} strokeWidth={2.2} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 25,
  },
  circleBtnWrapper: {
    borderRadius: 19,
    overflow: 'hidden',
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchCapsule: {
    width: 135,
    height: 38,
    borderRadius: 19,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '500',
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
});

