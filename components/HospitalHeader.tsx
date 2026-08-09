import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Text, Platform } from 'react-native';
import { ChevronLeft, Search, Share2, Heart, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';

interface HospitalHeaderProps {
  title?: string;
  onBackPress: () => void;
  onSearchChange?: (text: string) => void;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onSharePress?: () => void;
  isDark?: boolean;
}

export default function HospitalHeader({
  title = '',
  onBackPress,
  onSearchChange,
  isFavorite = false,
  onFavoriteToggle,
  onSharePress,
  isDark = true,
}: HospitalHeaderProps) {
  const insets = useSafeAreaInsets();
  const supportsLiquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable && isLiquidGlassAvailable();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTextChange = (text: string) => {
    setSearchQuery(text);
    if (onSearchChange) onSearchChange(text);
  };

  const topInset = Math.max(insets.top + (Platform.OS === 'ios' ? 4 : 8), 36);

  return (
    <View style={[styles.headerContainer, { top: topInset }]}>
      {/* Left Section: Circular Back Button + Hospital Title */}
      <View style={styles.leftGroup}>
        <TouchableOpacity
          onPress={onBackPress}
          style={styles.circleBtnWrapper}
          activeOpacity={0.8}
        >
          <View style={styles.circleBtn}>
            {supportsLiquidGlass ? (
              <GlassView glassEffectStyle="regular" isInteractive={true} style={[StyleSheet.absoluteFill, { borderRadius: 21, overflow: 'hidden' }]} />
            ) : Platform.OS === 'ios' ? (
              <BlurView intensity={45} tint="light" style={[StyleSheet.absoluteFill, { borderRadius: 21, overflow: 'hidden' }]} />
            ) : null}
            <ChevronLeft color="#0F172A" size={22} strokeWidth={2.5} />
          </View>
        </TouchableOpacity>

        {!isSearchOpen && (
          <Text style={styles.headerTitleText} numberOfLines={1}>
            {title}
          </Text>
        )}
      </View>

      {/* Right Action Group: Search, Share, Favorite */}
      <View style={styles.rightGroup}>
        {isSearchOpen ? (
          <View style={styles.searchCapsule}>
            {supportsLiquidGlass ? (
              <GlassView glassEffectStyle="regular" isInteractive={true} style={[StyleSheet.absoluteFill, { borderRadius: 21, overflow: 'hidden' }]} />
            ) : Platform.OS === 'ios' ? (
              <BlurView intensity={50} tint="light" style={[StyleSheet.absoluteFill, { borderRadius: 21, overflow: 'hidden' }]} />
            ) : null}
            <Search size={15} color="#0F172A" strokeWidth={2.2} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#64748B"
              value={searchQuery}
              onChangeText={handleTextChange}
              autoFocus
            />
            <TouchableOpacity onPress={() => { setIsSearchOpen(false); handleTextChange(''); }} style={{ padding: 4 }}>
              <X size={16} color="#64748B" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Search Action Button */}
            <TouchableOpacity
              onPress={() => setIsSearchOpen(true)}
              style={styles.circleBtnWrapper}
              activeOpacity={0.8}
            >
              <View style={styles.circleBtn}>
                {supportsLiquidGlass ? (
                  <GlassView glassEffectStyle="regular" isInteractive={true} style={[StyleSheet.absoluteFill, { borderRadius: 21, overflow: 'hidden' }]} />
                ) : Platform.OS === 'ios' ? (
                  <BlurView intensity={45} tint="light" style={[StyleSheet.absoluteFill, { borderRadius: 21, overflow: 'hidden' }]} />
                ) : null}
                <Search color="#0F172A" size={18} strokeWidth={2.2} />
              </View>
            </TouchableOpacity>

            {/* Share Action Button */}
            <TouchableOpacity
              onPress={onSharePress}
              style={styles.circleBtnWrapper}
              activeOpacity={0.8}
            >
              <View style={styles.circleBtn}>
                {supportsLiquidGlass ? (
                  <GlassView glassEffectStyle="regular" isInteractive={true} style={[StyleSheet.absoluteFill, { borderRadius: 21, overflow: 'hidden' }]} />
                ) : Platform.OS === 'ios' ? (
                  <BlurView intensity={45} tint="light" style={[StyleSheet.absoluteFill, { borderRadius: 21, overflow: 'hidden' }]} />
                ) : null}
                <Share2 color="#0F172A" size={18} strokeWidth={2.2} />
              </View>
            </TouchableOpacity>

            {/* Favorite / Heart Button */}
            <TouchableOpacity
              onPress={onFavoriteToggle}
              style={styles.circleBtnWrapper}
              activeOpacity={0.8}
            >
              <View style={styles.circleBtn}>
                {supportsLiquidGlass ? (
                  <GlassView glassEffectStyle="regular" isInteractive={true} style={[StyleSheet.absoluteFill, { borderRadius: 21, overflow: 'hidden' }]} />
                ) : Platform.OS === 'ios' ? (
                  <BlurView intensity={45} tint="light" style={[StyleSheet.absoluteFill, { borderRadius: 21, overflow: 'hidden' }]} />
                ) : null}
                <Heart 
                  color={isFavorite ? '#EF4444' : '#0F172A'} 
                  fill={isFavorite ? '#EF4444' : 'transparent'} 
                  size={18} 
                  strokeWidth={2.2} 
                />
              </View>
            </TouchableOpacity>
          </>
        )}
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
    zIndex: 35,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 4,
    flexShrink: 1,
  },
  circleBtnWrapper: {
    borderRadius: 21,
    overflow: 'hidden',
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchCapsule: {
    width: 170,
    height: 42,
    borderRadius: 21,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0F172A',
    paddingVertical: 0,
  },
});


