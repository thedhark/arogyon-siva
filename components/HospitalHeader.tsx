import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Text, Platform, Modal, Pressable, Animated } from 'react-native';
import { ChevronLeft, Search, Share2, Heart, X, MoreVertical } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';
import { Fonts } from '@/constants/theme';

interface HospitalHeaderProps {
  title?: string;
  onBackPress: () => void;
  onSearchChange?: (text: string) => void;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onSharePress?: () => void;
  isDark?: boolean;
  headerTitleOpacity?: any;
}

export default function HospitalHeader({
  title = '',
  onBackPress,
  onSearchChange,
  isFavorite = false,
  onFavoriteToggle,
  onSharePress,
  isDark = true,
  headerTitleOpacity,
}: HospitalHeaderProps) {
  const insets = useSafeAreaInsets();
  const supportsLiquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable && isLiquidGlassAvailable();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleTextChange = (text: string) => {
    setSearchQuery(text);
    if (onSearchChange) onSearchChange(text);
  };

  const topInset = Math.max(insets.top + (Platform.OS === 'ios' ? 4 : 8), 36);

  return (
    <View style={[styles.headerContainer, { top: topInset }]}>
      {/* Left Section: Circular Back Button */}
      <TouchableOpacity
        onPress={onBackPress}
        style={styles.circleBtnWrapper}
        activeOpacity={0.8}
      >
        <View style={[styles.circleBtn, { backgroundColor: isDark ? 'rgba(30, 41, 59, 0.75)' : 'rgba(241, 245, 249, 0.9)', borderWidth: 0 }]}>
          {supportsLiquidGlass ? (
            <GlassView glassEffectStyle="regular" isInteractive={true} style={[StyleSheet.absoluteFill, { borderRadius: 21, overflow: 'hidden' }]} />
          ) : Platform.OS === 'ios' ? (
            <BlurView intensity={45} tint={isDark ? 'dark' : 'light'} style={[StyleSheet.absoluteFill, { borderRadius: 21, overflow: 'hidden' }]} />
          ) : null}
          <ChevronLeft color={isDark ? '#FFFFFF' : '#0F172A'} size={22} strokeWidth={2.5} />
        </View>
      </TouchableOpacity>

      {/* Center Section: Search Bar OR Animated Hospital Title */}
      {isSearchOpen ? (
        <View style={[styles.searchCapsule, { backgroundColor: isDark ? 'rgba(30, 41, 59, 0.85)' : 'rgba(241, 245, 249, 0.95)', borderWidth: 0 }]}>
          {supportsLiquidGlass ? (
            <GlassView glassEffectStyle="regular" isInteractive={true} style={[StyleSheet.absoluteFill, { borderRadius: 21, overflow: 'hidden' }]} />
          ) : Platform.OS === 'ios' ? (
            <BlurView intensity={50} tint={isDark ? 'dark' : 'light'} style={[StyleSheet.absoluteFill, { borderRadius: 21, overflow: 'hidden' }]} />
          ) : null}
          <Search size={15} color={isDark ? 'rgba(255, 255, 255, 0.7)' : '#64748B'} strokeWidth={2.2} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#FFFFFF' : '#0F172A' }]}
            placeholder="Search experts, packages..."
            placeholderTextColor={isDark ? 'rgba(255, 255, 255, 0.6)' : '#94A3B8'}
            value={searchQuery}
            autoFocus
            onChangeText={handleTextChange}
          />
          <TouchableOpacity
            onPress={() => {
              handleTextChange('');
              setIsSearchOpen(false);
            }}
            style={{ padding: 4 }}
          >
            <X size={16} color={isDark ? 'rgba(255, 255, 255, 0.8)' : '#64748B'} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.centerTitleContainer}>
          <Animated.Text
            style={[
              styles.headerHospitalTitle,
              {
                color: isDark ? '#F8FAFC' : '#0F172A',
                opacity: headerTitleOpacity || 1,
              },
            ]}
            numberOfLines={1}
          >
            {title}
          </Animated.Text>
        </View>
      )}

      {/* Right Section: Circular Search Icon Button & Three Dots Button */}
      <View style={styles.rightActionsRow}>
        {!isSearchOpen && (
          <TouchableOpacity
            onPress={() => setIsSearchOpen(true)}
            style={styles.circleBtnWrapper}
            activeOpacity={0.8}
          >
            <View style={[styles.circleBtn, { backgroundColor: isDark ? 'rgba(30, 41, 59, 0.75)' : 'rgba(241, 245, 249, 0.9)', borderWidth: 0 }]}>
              {supportsLiquidGlass ? (
                <GlassView glassEffectStyle="regular" isInteractive={true} style={[StyleSheet.absoluteFill, { borderRadius: 21, overflow: 'hidden' }]} />
              ) : Platform.OS === 'ios' ? (
                <BlurView intensity={45} tint={isDark ? 'dark' : 'light'} style={[StyleSheet.absoluteFill, { borderRadius: 21, overflow: 'hidden' }]} />
              ) : null}
              <Search color={isDark ? '#FFFFFF' : '#0F172A'} size={19} strokeWidth={2.3} />
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => setIsMenuOpen(true)}
          style={styles.circleBtnWrapper}
          activeOpacity={0.8}
        >
          <View style={[styles.circleBtn, { backgroundColor: isDark ? 'rgba(30, 41, 59, 0.75)' : 'rgba(241, 245, 249, 0.9)', borderWidth: 0 }]}>
            {supportsLiquidGlass ? (
              <GlassView glassEffectStyle="regular" isInteractive={true} style={[StyleSheet.absoluteFill, { borderRadius: 21, overflow: 'hidden' }]} />
            ) : Platform.OS === 'ios' ? (
              <BlurView intensity={45} tint={isDark ? 'dark' : 'light'} style={[StyleSheet.absoluteFill, { borderRadius: 21, overflow: 'hidden' }]} />
            ) : null}
            <MoreVertical color={isDark ? '#FFFFFF' : '#0F172A'} size={20} strokeWidth={2.2} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Three Dots Menu Modal */}
      {isMenuOpen && (
        <Modal
          visible={isMenuOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsMenuOpen(false)}
        >
          <Pressable style={styles.menuOverlay} onPress={() => setIsMenuOpen(false)}>
            <View style={[styles.menuDropdown, { backgroundColor: isDark ? '#1E1E24' : '#FFFFFF', top: topInset + 48 }]}>
              {/* Favorite Option */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setIsMenuOpen(false);
                  if (onFavoriteToggle) onFavoriteToggle();
                }}
              >
                <Heart
                  color={isFavorite ? '#EF4444' : (isDark ? '#CBD5E1' : '#475569')}
                  fill={isFavorite ? '#EF4444' : 'transparent'}
                  size={18}
                  strokeWidth={2.2}
                />
                <Text style={[styles.menuItemText, { color: isFavorite ? '#EF4444' : (isDark ? '#E2E8F0' : '#1E293B') }]}>
                  {isFavorite ? 'Liked' : 'Like'}
                </Text>
              </TouchableOpacity>

              {/* Share Option */}
              <TouchableOpacity
                style={[styles.menuItem, { borderTopWidth: 0.5, borderTopColor: isDark ? '#333333' : '#E2E8F0' }]}
                onPress={() => {
                  setIsMenuOpen(false);
                  if (onSharePress) onSharePress();
                }}
              >
                <Share2 color={isDark ? '#CBD5E1' : '#475569'} size={18} strokeWidth={2.2} />
                <Text style={[styles.menuItemText, { color: isDark ? '#E2E8F0' : '#1E293B' }]}>
                  Share
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      )}
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
    backgroundColor: Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(15, 23, 42, 0.75)',
    borderWidth: 0,
  },
  searchCapsule: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginHorizontal: 8,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(15, 23, 42, 0.75)',
    borderWidth: 0,
    overflow: 'hidden',
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingVertical: 0,
    paddingHorizontal: 4,
  },
  centerTitleContainer: {
    flex: 1,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerHospitalTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  rightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  menuDropdown: {
    position: 'absolute',
    right: 16,
    width: 140,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  menuItemText: {
    fontSize: 13.5,
    fontFamily: Fonts.medium,
    fontWeight: '600',
  },
});



