import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronDown,
  Search,
  Target,
  ChevronRight,
  MapPin,
  Check,
  X,
  Building2,
  Compass,
} from 'lucide-react-native';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import { useAddressStore } from '@/hooks/useAddressStore';

interface LocationSuggestion {
  id: string;
  title: string;
  subtitle: string;
  fullAddress: string;
  city?: string;
  lat?: number;
  lon?: number;
}

// Major Indian Medical & Metropolitan Hubs for instant 0-ms selection
const POPULAR_CITIES = [
  { id: 'city-1', title: 'Bengaluru', subtitle: 'Karnataka', fullAddress: 'Bengaluru, Karnataka, India', icon: '🏙️', lat: 12.9716, lon: 77.5946 },
  { id: 'city-2', title: 'Hyderabad', subtitle: 'Telangana', fullAddress: 'Hyderabad, Telangana, India', icon: '🏛️', lat: 17.3850, lon: 78.4867 },
  { id: 'city-3', title: 'Chennai', subtitle: 'Tamil Nadu', fullAddress: 'Chennai, Tamil Nadu, India', icon: '🌊', lat: 13.0827, lon: 80.2707 },
  { id: 'city-4', title: 'Tirupati', subtitle: 'Andhra Pradesh', fullAddress: 'Tirupati, Andhra Pradesh, India', icon: '🛕', lat: 13.6288, lon: 79.4192 },
  { id: 'city-5', title: 'Mumbai', subtitle: 'Maharashtra', fullAddress: 'Mumbai, Maharashtra, India', icon: '🌇', lat: 19.0760, lon: 72.8777 },
  { id: 'city-6', title: 'Delhi NCR', subtitle: 'Delhi', fullAddress: 'New Delhi, Delhi, India', icon: '🏛️', lat: 28.6139, lon: 77.2090 },
  { id: 'city-7', title: 'Visakhapatnam', subtitle: 'Andhra Pradesh', fullAddress: 'Visakhapatnam, Andhra Pradesh, India', icon: '⚓', lat: 17.6868, lon: 83.2185 },
  { id: 'city-8', title: 'Kolkata', subtitle: 'West Bengal', fullAddress: 'Kolkata, West Bengal, India', icon: '🌉', lat: 22.5726, lon: 88.3639 },
  { id: 'city-9', title: 'Pune', subtitle: 'Maharashtra', fullAddress: 'Pune, Maharashtra, India', icon: '🏫', lat: 18.5204, lon: 73.8567 },
];

const POPULAR_LOCALITIES = [
  { id: 'loc-1', title: 'Koramangala', subtitle: 'Bengaluru, Karnataka', fullAddress: 'Koramangala, Bengaluru, Karnataka', lat: 12.9352, lon: 77.6245 },
  { id: 'loc-2', title: 'Indiranagar', subtitle: 'Bengaluru, Karnataka', fullAddress: 'Indiranagar, Bengaluru, Karnataka', lat: 12.9784, lon: 77.6408 },
  { id: 'loc-3', title: 'HSR Layout', subtitle: 'Bengaluru, Karnataka', fullAddress: 'HSR Layout, Bengaluru, Karnataka', lat: 12.9121, lon: 77.6446 },
  { id: 'loc-4', title: 'Whitefield', subtitle: 'Bengaluru, Karnataka', fullAddress: 'Whitefield, Bengaluru, Karnataka', lat: 12.9698, lon: 77.7500 },
  { id: 'loc-5', title: 'Banjara Hills', subtitle: 'Hyderabad, Telangana', fullAddress: 'Banjara Hills, Hyderabad, Telangana', lat: 17.4156, lon: 78.4347 },
  { id: 'loc-6', title: 'HITECH City', subtitle: 'Hyderabad, Telangana', fullAddress: 'HITECH City, Madhapur, Hyderabad, Telangana', lat: 17.4435, lon: 78.3772 },
  { id: 'loc-7', title: 'Mangalam', subtitle: 'Tirupati, Andhra Pradesh', fullAddress: 'Mangalam Road, Tirupati, Andhra Pradesh', lat: 13.6350, lon: 79.4300 },
  { id: 'loc-8', title: 'Anna Nagar', subtitle: 'Chennai, Tamil Nadu', fullAddress: 'Anna Nagar, Chennai, Tamil Nadu', lat: 13.0850, lon: 80.2101 },
];

export default function LocationSelectScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const currentLocation = useAddressStore((state) => state.currentLocation);
  const setLocation = useAddressStore((state) => state.setLocation);
  const addAddress = useAddressStore((state) => state.addAddress);

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  // Perform multi-source search (Instant Local + Photon Geocoding)
  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    const qLower = trimmed.toLowerCase();
    const allLocal = [...POPULAR_CITIES, ...POPULAR_LOCALITIES];
    const localMatches: LocationSuggestion[] = allLocal.filter((item) => {
      const t = item.title.toLowerCase();
      const s = item.subtitle.toLowerCase();
      const f = item.fullAddress.toLowerCase();
      return t.includes(qLower) || s.includes(qLower) || f.includes(qLower);
    });

    setSuggestions(localMatches);
    setIsSearching(true);

    searchDebounceRef.current = setTimeout(async () => {
      try {
        const encodedQuery = encodeURIComponent(trimmed);
        const photonUrl = `https://photon.komoot.io/api/?q=${encodedQuery}&limit=6`;
        const photonRes = await fetch(photonUrl).catch(() => null);

        let apiSuggestions: LocationSuggestion[] = [];

        if (photonRes && photonRes.ok) {
          const photonData = await photonRes.json();
          if (photonData.features && photonData.features.length > 0) {
            apiSuggestions = photonData.features.map((feat: any, idx: number) => {
              const props = feat.properties;
              const title = props.name || props.city || props.street || trimmed;
              const parts = [props.district, props.city, props.state, props.country].filter(Boolean);
              const subtitle = parts.join(', ') || 'Location';
              const fullAddress = `${title}, ${subtitle}`;
              const coords = feat.geometry?.coordinates;
              return {
                id: `photon-${idx}-${Date.now()}`,
                title,
                subtitle,
                fullAddress,
                city: props.city || props.state || title,
                lat: coords ? coords[1] : undefined,
                lon: coords ? coords[0] : undefined,
              };
            });
          }
        }

        const combinedMap = new Map<string, LocationSuggestion>();
        [...localMatches, ...apiSuggestions].forEach((item) => {
          const key = item.title.toLowerCase();
          if (!combinedMap.has(key)) {
            combinedMap.set(key, item);
          }
        });

        setSuggestions(Array.from(combinedMap.values()));
      } catch (err) {
        console.warn('Location search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchQuery]);

  const handleSelectLocation = (item: { title: string; subtitle?: string; fullAddress: string; lat?: number; lon?: number; city?: string }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const cityName = item.city || item.title;
    const areaName = item.title;

    setLocation({
      city: cityName,
      area: areaName,
      fullAddress: item.fullAddress,
      latitude: item.lat,
      longitude: item.lon,
    });

    addAddress({
      type: areaName,
      address: item.fullAddress,
      city: cityName,
      distance: 'Selected',
      isDefault: true,
      latitude: item.lat,
      longitude: item.lon,
    });

    showToast(`Location set to ${areaName}!`);
    setTimeout(() => {
      router.back();
    }, 500);
  };

  const handleUseCurrentLocation = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please enable location permissions in settings to automatically detect your nearby hospitals.');
        setIsLocating(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const geocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      let formattedAddr = 'Tirupati, Andhra Pradesh, India';
      let titleCity = 'Current Location';

      if (geocode && geocode.length > 0) {
        const place = geocode[0];
        titleCity = place.city || place.subregion || place.name || 'Current Location';
        const parts = [
          place.name || place.street,
          place.subregion || place.district || place.city,
          place.region,
        ].filter(Boolean);
        formattedAddr = parts.join(', ');
      }

      handleSelectLocation({
        title: titleCity,
        subtitle: formattedAddr,
        fullAddress: formattedAddr,
        city: titleCity,
        lat: loc.coords.latitude,
        lon: loc.coords.longitude,
      });
    } catch (err) {
      console.warn('GPS Error:', err);
      handleSelectLocation(POPULAR_CITIES[0]);
    } finally {
      setIsLocating(false);
    }
  };

  const cardBg = isDark ? '#1C1929' : '#FFFFFF';
  const textColor = isDark ? '#F1F5F9' : '#0F172A';
  const subTextColor = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0F0D15' : '#F8FAFC' }]}>
      {/* Toast Notification */}
      {toastMessage && (
        <Animated.View
          entering={FadeInDown}
          exiting={FadeOutUp}
          style={[styles.toast, { backgroundColor: '#0F172A', top: insets.top + 10 }]}
        >
          <Check size={18} color="#10B981" style={{ marginRight: 8 }} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}

      {/* Top Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: isDark ? '#1C1929' : '#FFFFFF', borderColor }]}
          activeOpacity={0.7}
        >
          <ChevronDown size={24} color={textColor} strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.headerTitle, { color: textColor }]}>Select Location</Text>
          <Text style={[styles.headerSubtitle, { color: subTextColor }]}>
            Find specialist doctors & top hospitals near you
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Bar Input */}
        <Animated.View entering={FadeInDown.delay(100)} style={[styles.searchContainer, { backgroundColor: cardBg, borderColor }]}>
          <Search size={20} color="#3B82F6" strokeWidth={2.5} />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search city, area or landmark..."
            placeholderTextColor={isDark ? '#6B7280' : '#94A3B8'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
              <X size={18} color={subTextColor} />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Live Search Suggestions (When user is typing) */}
        {searchQuery.trim().length > 0 ? (
          <Animated.View entering={FadeInDown} style={[styles.searchResultsBox, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.searchHeaderRow}>
              <Text style={styles.searchHeaderTitle}>MATCHING LOCATIONS</Text>
              {isSearching && <ActivityIndicator size="small" color="#3B82F6" />}
            </View>

            {suggestions.length === 0 && !isSearching ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: subTextColor, fontSize: 14, textAlign: 'center' }}>
                  No matching cities or areas found for "{searchQuery}".
                </Text>
              </View>
            ) : (
              suggestions.map((item, idx) => (
                <TouchableOpacity
                  key={item.id + idx}
                  style={[
                    styles.searchResultItemRow,
                    idx < suggestions.length - 1 && { borderBottomWidth: 1, borderBottomColor: borderColor }
                  ]}
                  onPress={() => handleSelectLocation(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.suggestionIconWrap}>
                    <MapPin size={18} color="#3B82F6" strokeWidth={2.2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.searchResultTitle, { color: textColor }]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={[styles.searchResultSubtitle, { color: subTextColor }]} numberOfLines={1}>
                      {item.subtitle}
                    </Text>
                  </View>
                  <ChevronRight size={18} color={subTextColor} />
                </TouchableOpacity>
              ))
            )}
          </Animated.View>
        ) : (
          <>
            {/* Quick Action: Use Current Location */}
            <Animated.View entering={FadeInDown.delay(150)} style={[styles.actionCardBox, { backgroundColor: cardBg, borderColor }]}>
              <TouchableOpacity
                style={styles.actionRow}
                activeOpacity={0.7}
                onPress={handleUseCurrentLocation}
                disabled={isLocating}
              >
                <View style={styles.actionLeftIcon}>
                  {isLocating ? (
                    <ActivityIndicator size="small" color="#3B82F6" />
                  ) : (
                    <Target size={22} color="#3B82F6" strokeWidth={2.2} />
                  )}
                </View>
                <View style={styles.actionTextCol}>
                  <Text style={styles.actionPrimaryText}>Use current location</Text>
                  <Text style={[styles.actionSubText, { color: subTextColor }]} numberOfLines={1}>
                    {currentLocation?.fullAddress || 'Auto-detect using GPS for instant nearby hospitals'}
                  </Text>
                </View>
                <ChevronRight size={20} color={isDark ? '#6B7280' : '#94A3B8'} />
              </TouchableOpacity>
            </Animated.View>

            {/* Popular Cities Grid */}
            <Animated.View entering={FadeInDown.delay(200)} style={styles.sectionHeaderWrap}>
              <Compass size={16} color="#3B82F6" style={{ marginRight: 6 }} />
              <Text style={styles.sectionHeaderText}>POPULAR CITIES</Text>
            </Animated.View>

            <View style={styles.citiesGrid}>
              {POPULAR_CITIES.map((city, idx) => {
                const isSelected = currentLocation?.city?.toLowerCase() === city.title.toLowerCase() || 
                                   currentLocation?.area?.toLowerCase() === city.title.toLowerCase();
                return (
                  <TouchableOpacity
                    key={city.id}
                    style={[
                      styles.cityCard,
                      {
                        backgroundColor: cardBg,
                        borderColor: isSelected ? '#3B82F6' : borderColor,
                        borderWidth: isSelected ? 1.5 : 1,
                      }
                    ]}
                    onPress={() => handleSelectLocation(city)}
                    activeOpacity={0.75}
                  >
                    <Text style={{ fontSize: 24, marginBottom: 6 }}>{city.icon}</Text>
                    <Text style={[styles.cityCardTitle, { color: isSelected ? '#3B82F6' : textColor }]} numberOfLines={1}>
                      {city.title}
                    </Text>
                    <Text style={[styles.cityCardSubtitle, { color: subTextColor }]} numberOfLines={1}>
                      {city.subtitle}
                    </Text>
                    {isSelected && (
                      <View style={styles.selectedPill}>
                        <Check size={10} color="#FFFFFF" strokeWidth={3} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Top Medical Hubs & Localities */}
            <Animated.View entering={FadeInDown.delay(250)} style={[styles.sectionHeaderWrap, { marginTop: 24 }]}>
              <Building2 size={16} color="#3B82F6" style={{ marginRight: 6 }} />
              <Text style={styles.sectionHeaderText}>KEY HEALTHCARE REGIONS</Text>
            </Animated.View>

            <View style={[styles.localitiesList, { backgroundColor: cardBg, borderColor }]}>
              {POPULAR_LOCALITIES.map((loc, idx) => (
                <TouchableOpacity
                  key={loc.id}
                  style={[
                    styles.localityRow,
                    idx < POPULAR_LOCALITIES.length - 1 && { borderBottomWidth: 1, borderBottomColor: borderColor }
                  ]}
                  onPress={() => handleSelectLocation(loc)}
                  activeOpacity={0.7}
                >
                  <View style={styles.localityIcon}>
                    <MapPin size={16} color="#3B82F6" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.localityTitle, { color: textColor }]}>{loc.title}</Text>
                    <Text style={[styles.localitySubtitle, { color: subTextColor }]}>{loc.subtitle}</Text>
                  </View>
                  <ChevronRight size={16} color={subTextColor} />
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toast: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
  },
  headerSubtitle: {
    fontSize: 12.5,
    fontFamily: Fonts.regular,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14.5,
    fontFamily: Fonts.medium,
    marginLeft: 10,
  },
  actionCardBox: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionLeftIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  actionTextCol: {
    flex: 1,
    marginRight: 8,
  },
  actionPrimaryText: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: '#3B82F6',
  },
  actionSubText: {
    fontSize: 12.5,
    fontFamily: Fonts.regular,
    marginTop: 2,
  },
  sectionHeaderWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: '#64748B',
    letterSpacing: 0.8,
  },
  citiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  cityCard: {
    width: '31%',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    position: 'relative',
  },
  cityCardTitle: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
  },
  cityCardSubtitle: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    marginTop: 2,
    textAlign: 'center',
  },
  selectedPill: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  localitiesList: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  localityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  localityIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  localityTitle: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
  },
  localitySubtitle: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    marginTop: 1,
  },
  searchResultsBox: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  searchHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  searchHeaderTitle: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    color: '#64748B',
    letterSpacing: 0.8,
  },
  searchResultItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  suggestionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  searchResultTitle: {
    fontSize: 14.5,
    fontFamily: Fonts.semiBold,
  },
  searchResultSubtitle: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    marginTop: 2,
  },
});
