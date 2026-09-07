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
  onSearchOpenChange?: (isOpen: boolean) => void;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onSharePress?: () => void;
  isDark?: boolean;
  headerTitleOpacity?: any;
  headerBackdropOpacity?: any;
}

export default function HospitalHeader({
  title = '',
  onBackPress,
  onSearchChange,
  onSearchOpenChange,
  isFavorite = false,
  onFavoriteToggle,
  onSharePress,
  isDark = true,
  headerTitleOpacity,
  headerBackdropOpacity,
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

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
    if (onSearchOpenChange) onSearchOpenChange(true);
  };

  const handleCloseSearch = () => {
    handleTextChange('');
    setIsSearchOpen(false);
    if (onSearchOpenChange) onSearchOpenChange(false);
  };

  const topInset = Math.max(insets.top + (Platform.OS === 'ios' ? 2 : 4), 28);

  // Cross-fade opacity between white (over hero cover image) and dark (on solid white header in light mode)
  const whiteIconOpacity = headerBackdropOpacity
    ? headerBackdropOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      })
    : 1;

  const darkIconOpacity = headerBackdropOpacity || 0;

  return (
    <View style={[styles.headerContainer, { top: topInset }]}>
      {/* Left Section: Clean Back Button (No wrapper around it) */}
      <TouchableOpacity
        onPress={onBackPress}
        style={styles.cleanActionBtn}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Animated.View style={{ opacity: isDark ? 1 : whiteIconOpacity }}>
          <ChevronLeft color="#FFFFFF" size={24} strokeWidth={2.5} style={styles.iconDropShadow} />
        </Animated.View>
        {!isDark && (
          <Animated.View style={[StyleSheet.absoluteFill, styles.centerAlign, { opacity: darkIconOpacity }]}>
            <ChevronLeft color="#0F172A" size={24} strokeWidth={2.5} />
          </Animated.View>
        )}
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
            placeholder="Search experts, care..."
            placeholderTextColor={isDark ? 'rgba(255, 255, 255, 0.6)' : '#94A3B8'}
            value={searchQuery}
            autoFocus
            onChangeText={handleTextChange}
          />
          <TouchableOpacity
            onPress={handleCloseSearch}
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

      {/* Right Section: Clean Search & Three Dots Action Buttons (No wrapper around it) */}
      <View style={styles.rightActionsRow}>
        {!isSearchOpen && (
          <TouchableOpacity
            onPress={handleOpenSearch}
            style={styles.cleanActionBtn}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Animated.View style={{ opacity: isDark ? 1 : whiteIconOpacity }}>
              <Search color="#FFFFFF" size={21} strokeWidth={2.3} style={styles.iconDropShadow} />
            </Animated.View>
            {!isDark && (
              <Animated.View style={[StyleSheet.absoluteFill, styles.centerAlign, { opacity: darkIconOpacity }]}>
                <Search color="#0F172A" size={21} strokeWidth={2.3} />
              </Animated.View>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => setIsMenuOpen(true)}
          style={styles.cleanActionBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Animated.View style={{ opacity: isDark ? 1 : whiteIconOpacity }}>
            <MoreVertical color="#FFFFFF" size={22} strokeWidth={2.3} style={styles.iconDropShadow} />
          </Animated.View>
          {!isDark && (
            <Animated.View style={[StyleSheet.absoluteFill, styles.centerAlign, { opacity: darkIconOpacity }]}>
              <MoreVertical color="#0F172A" size={22} strokeWidth={2.3} />
            </Animated.View>
          )}
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
    zIndex: 100,
    elevation: 10,
  },
  cleanActionBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  centerAlign: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDropShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 2.5,
    elevation: 2,
  },
  searchCapsule: {
    flex: 1,
    height: 38,
    borderRadius: 19,
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



