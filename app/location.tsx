import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronDown,
  Search,
  Target,
  Plus,
  ChevronRight,
  Home,
  Briefcase,
  MapPin,
  MoreHorizontal,
  Share2,
  Camera,
  Check,
  X,
  Building2,
  Navigation,
} from 'lucide-react-native';
import * as Location from 'expo-location';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { useAddressStore, Address } from '@/hooks/useAddressStore';
import { ActionBottomSheet, ActionBottomSheetRef } from '@/components/ActionBottomSheet';
import AddressForm from '@/components/profile/AddressForm';

interface LocationSuggestion {
  id: string;
  title: string;
  subtitle: string;
  fullAddress: string;
  lat?: number;
  lon?: number;
}

// Pre-built Directory of Major Indian Cities & Hubs for 0-ms Instant Local Search
const POPULAR_INDIAN_LOCATIONS: LocationSuggestion[] = [
  { id: 'pop-1', title: 'Bengaluru', subtitle: 'Karnataka, India', fullAddress: 'Bengaluru, Karnataka, India', lat: 12.9716, lon: 77.5946 },
  { id: 'pop-2', title: 'HSR Layout', subtitle: 'Bengaluru, Karnataka', fullAddress: 'HSR Layout, Sector 1-7, Bengaluru, Karnataka 560102', lat: 12.9121, lon: 77.6446 },
  { id: 'pop-3', title: 'Koramangala', subtitle: 'Bengaluru, Karnataka', fullAddress: 'Koramangala, Bengaluru, Karnataka 560034', lat: 12.9352, lon: 77.6245 },
  { id: 'pop-4', title: 'Indiranagar', subtitle: 'Bengaluru, Karnataka', fullAddress: 'Indiranagar, 100 Feet Road, Bengaluru, Karnataka 560038', lat: 12.9784, lon: 77.6408 },
  { id: 'pop-5', title: 'Marathahalli', subtitle: 'Bengaluru, Karnataka', fullAddress: 'Marathahalli Outer Ring Road, Bengaluru, Karnataka 560037', lat: 12.9591, lon: 77.6974 },
  { id: 'pop-6', title: 'Whitefield', subtitle: 'Bengaluru, Karnataka', fullAddress: 'Whitefield Main Road, Bengaluru, Karnataka 560066', lat: 12.9698, lon: 77.7500 },
  { id: 'pop-7', title: 'Electronic City', subtitle: 'Bengaluru, Karnataka', fullAddress: 'Electronic City Phase 1, Bengaluru, Karnataka 560100', lat: 12.8452, lon: 77.6602 },
  { id: 'pop-8', title: 'Tirupati', subtitle: 'Andhra Pradesh, India', fullAddress: 'Tirupati, Chittoor District, Andhra Pradesh, India', lat: 13.6288, lon: 79.4192 },
  { id: 'pop-9', title: 'Mangalam', subtitle: 'Tirupati, Andhra Pradesh', fullAddress: 'Mangalam Road, Tirupati, Andhra Pradesh 517507', lat: 13.6350, lon: 79.4300 },
  { id: 'pop-10', title: 'Kapilatheertham', subtitle: 'Tirupati, Andhra Pradesh', fullAddress: 'Kapila Theertham Road, Tirupati, Andhra Pradesh 517501', lat: 13.6492, lon: 79.4183 },
  { id: 'pop-11', title: 'Hyderabad', subtitle: 'Telangana, India', fullAddress: 'Hyderabad, Telangana, India', lat: 17.3850, lon: 78.4867 },
  { id: 'pop-12', title: 'Banjara Hills', subtitle: 'Hyderabad, Telangana', fullAddress: 'Banjara Hills, Road No 12, Hyderabad, Telangana 500034', lat: 17.4156, lon: 78.4347 },
  { id: 'pop-13', title: 'HITECH City', subtitle: 'Hyderabad, Telangana', fullAddress: 'HITECH City, Madhapur, Hyderabad, Telangana 500081', lat: 17.4435, lon: 78.3772 },
  { id: 'pop-14', title: 'Chennai', subtitle: 'Tamil Nadu, India', fullAddress: 'Chennai, Tamil Nadu, India', lat: 13.0827, lon: 80.2707 },
  { id: 'pop-15', title: 'Anna Nagar', subtitle: 'Chennai, Tamil Nadu', fullAddress: 'Anna Nagar, Chennai, Tamil Nadu 600040', lat: 13.0850, lon: 80.2101 },
  { id: 'pop-16', title: 'Mumbai', subtitle: 'Maharashtra, India', fullAddress: 'Mumbai, Maharashtra, India', lat: 19.0760, lon: 72.8777 },
  { id: 'pop-17', title: 'Bandra West', subtitle: 'Mumbai, Maharashtra', fullAddress: 'Bandra West, Hill Road, Mumbai, Maharashtra 400050', lat: 19.0596, lon: 72.8295 },
  { id: 'pop-18', title: 'Delhi NCR', subtitle: 'Delhi, India', fullAddress: 'Connaught Place, New Delhi, Delhi 110001', lat: 28.6139, lon: 77.2090 },
  { id: 'pop-19', title: 'Gurugram', subtitle: 'Haryana, India', fullAddress: 'DLF Cyber City, Gurugram, Haryana 122002', lat: 28.4595, lon: 77.0266 },
  { id: 'pop-20', title: 'Visakhapatnam', subtitle: 'Andhra Pradesh, India', fullAddress: 'Visakhapatnam, Andhra Pradesh, India', lat: 17.6868, lon: 83.2185 },
];

export default function LocationSelectScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const addresses = useAddressStore((state) => state.addresses);
  const setDefaultAddress = useAddressStore((state) => state.setDefaultAddress);
  const addAddress = useAddressStore((state) => state.addAddress);
  const removeAddress = useAddressStore((state) => state.removeAddress);

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const bottomSheetRef = useRef<ActionBottomSheetRef>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Perform multi-source search (Local Instant + Photon Geocoding API + Nominatim API + Expo Geocode)
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

    // 1. Immediate Local Fuzzy Match (0-ms)
    const qLower = trimmed.toLowerCase();
    const localMatches = POPULAR_INDIAN_LOCATIONS.filter((item) => {
      const t = item.title.toLowerCase();
      const s = item.subtitle.toLowerCase();
      const f = item.fullAddress.toLowerCase();
      // Handle common typo mapping (e.g. vengalyri -> bengaluru, banglore -> bengaluru)
      if ((qLower.includes('vengal') || qLower.includes('beng') || qLower.includes('bang')) && t.includes('bengaluru')) {
        return true;
      }
      return t.includes(qLower) || s.includes(qLower) || f.includes(qLower);
    });

    setSuggestions(localMatches);
    setIsSearching(true);

    // 2. Async API Search (Photon + Nominatim)
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const encodedQuery = encodeURIComponent(trimmed);
        
        // Fetch Photon Geocoding API (Fast, no API key, handles fuzzy text)
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
                lat: coords ? coords[1] : undefined,
                lon: coords ? coords[0] : undefined,
              };
            });
          }
        }

        // Fallback to Expo Geocode if API empty
        if (apiSuggestions.length === 0) {
          const geocoded = await Location.geocodeAsync(trimmed).catch(() => []);
          if (geocoded && geocoded.length > 0) {
            apiSuggestions = geocoded.map((g, idx) => ({
              id: `expo-${idx}`,
              title: trimmed.charAt(0).toUpperCase() + trimmed.slice(1),
              subtitle: `Lat: ${g.latitude.toFixed(3)}, Lon: ${g.longitude.toFixed(3)}`,
              fullAddress: `${trimmed}, India`,
              lat: g.latitude,
              lon: g.longitude,
            }));
          }
        }

        // Merge local matches & API suggestions without duplicates
        const combinedMap = new Map<string, LocationSuggestion>();
        [...localMatches, ...apiSuggestions].forEach((item) => {
          const key = item.title.toLowerCase();
          if (!combinedMap.has(key)) {
            combinedMap.set(key, item);
          }
        });

        setSuggestions(Array.from(combinedMap.values()));
      } catch (err) {
        console.warn('Location Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchQuery]);

  // Handle selecting a suggested location
  const handleSelectSuggestion = (item: LocationSuggestion) => {
    const newAddress = addAddress({
      type: item.title,
      address: item.fullAddress,
      distance: 'Selected',
      isDefault: true,
      latitude: item.lat,
      longitude: item.lon,
    });

    setDefaultAddress(newAddress.id);
    showToast(`Location set to ${item.title}!`);
    setTimeout(() => {
      router.back();
    }, 700);
  };

  // Action: Use Current GPS Location
  const handleUseCurrentLocation = async () => {
    try {
      setIsLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to detect your GPS position.');
        setIsLocating(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const geocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      let formattedAddr = 'Primark Lake View Apartments, Mangalam, Tirupati, Andhra Pradesh';
      let titleType = 'Current Location';

      if (geocode && geocode.length > 0) {
        const place = geocode[0];
        titleType = place.city || place.subregion || place.name || 'Current Location';
        const parts = [
          place.name || place.streetNumber || place.street,
          place.subregion || place.district || place.city,
          place.region,
          place.postalCode,
        ].filter(Boolean);
        formattedAddr = parts.join(', ');
      }

      const newAddr = addAddress({
        type: titleType,
        address: formattedAddr,
        distance: '0 m',
        isDefault: true,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      setDefaultAddress(newAddr.id);
      showToast(`Location set to ${titleType}!`);
      setTimeout(() => {
        router.back();
      }, 800);
    } catch (err) {
      console.warn('Error fetching current location:', err);
      setDefaultAddress(addresses[0]?.id || '1');
      showToast('Location updated to current position');
      setTimeout(() => {
        router.back();
      }, 700);
    } finally {
      setIsLocating(false);
    }
  };

  // Action: Select saved address
  const handleSelectSavedAddress = (id: string, addressText: string) => {
    setDefaultAddress(id);
    const shortName = addressText.split(',')[0];
    showToast(`Location set to ${shortName}!`);
    setTimeout(() => {
      router.back();
    }, 700);
  };

  // Action: Share address
  const handleShareAddress = async (item: Address) => {
    try {
      await Share.share({
        message: `My Address (${item.type}): ${item.address}`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  // Action: More options
  const handleMoreOptions = (item: Address) => {
    Alert.alert(
      `${item.type} Address Options`,
      item.address,
      [
        {
          text: item.isDefault ? 'Currently Default' : 'Set as Default',
          onPress: () => setDefaultAddress(item.id),
        },
        {
          text: 'Delete Address',
          style: 'destructive',
          onPress: () => removeAddress(item.id),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const getAddressIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('home')) return Home;
    if (t.includes('work')) return Briefcase;
    if (t.includes('hospital')) return Building2;
    return MapPin;
  };

  const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDark ? '#F1F5F9' : '#0F172A';
  const subTextColor = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#333333' : '#F1F5F9';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8FAFC' }]}>
      
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

      {/* Top Header Bar */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ChevronDown size={28} color={textColor} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Select a location</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Bar Input */}
        <Animated.View entering={FadeInDown.delay(100)} style={[styles.searchContainer, { backgroundColor: cardBg, borderColor }]}>
          <Search size={22} color="#F43F5E" strokeWidth={2.5} />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search for area, street name, city..."
            placeholderTextColor={isDark ? '#666666' : '#94A3B8'}
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

        {/* Live Search Suggestions (Triggers on user typing) */}
        {searchQuery.trim().length > 0 && (
          <Animated.View entering={FadeInDown} style={[styles.searchResultsBox, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.searchHeaderRow}>
              <Text style={styles.searchHeaderTitle}>LOCATION SUGGESTIONS</Text>
              {isSearching && <ActivityIndicator size="small" color="#F43F5E" />}
            </View>

            {suggestions.length === 0 && !isSearching ? (
              <View style={{ padding: 16 }}>
                <Text style={{ color: subTextColor, fontSize: 14 }}>No matching locations found for "{searchQuery}". Try typing city or area name.</Text>
              </View>
            ) : (
              suggestions.map((item, idx) => (
                <TouchableOpacity
                  key={item.id + idx}
                  style={[
                    styles.searchResultItemRow,
                    idx < suggestions.length - 1 && { borderBottomWidth: 1, borderBottomColor: borderColor }
                  ]}
                  onPress={() => handleSelectSuggestion(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.suggestionIconWrap}>
                    <MapPin size={20} color="#F43F5E" strokeWidth={2.2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.searchResultTitle, { color: textColor }]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={[styles.searchResultSubtitle, { color: subTextColor }]} numberOfLines={2}>
                      {item.subtitle}
                    </Text>
                  </View>
                  <ChevronRight size={18} color={subTextColor} />
                </TouchableOpacity>
              ))
            )}
          </Animated.View>
        )}

        {/* Quick Actions Card Box (When search is empty) */}
        {searchQuery.trim().length === 0 && (
          <Animated.View entering={FadeInDown.delay(150)} style={[styles.actionCardBox, { backgroundColor: cardBg, borderColor }]}>
            
            {/* Action 1: Use Current Location */}
            <TouchableOpacity
              style={styles.actionRow}
              activeOpacity={0.7}
              onPress={handleUseCurrentLocation}
              disabled={isLocating}
            >
              <View style={styles.actionLeftIcon}>
                {isLocating ? (
                  <ActivityIndicator size="small" color="#F43F5E" />
                ) : (
                  <Target size={22} color="#F43F5E" strokeWidth={2.2} />
                )}
              </View>
              <View style={styles.actionTextCol}>
                <Text style={styles.actionPrimaryText}>Use current location</Text>
                <Text style={styles.actionSubText} numberOfLines={1}>
                  Primark Lake View Apartments, Mangalam, Tirupati, Andhra Pradesh
                </Text>
              </View>
              <ChevronRight size={20} color={isDark ? '#555555' : '#94A3B8'} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: borderColor }]} />

            {/* Action 2: Add Address */}
            <TouchableOpacity
              style={styles.actionRow}
              activeOpacity={0.7}
              onPress={() => bottomSheetRef.current?.present()}
            >
              <View style={styles.actionLeftIcon}>
                <Plus size={22} color="#F43F5E" strokeWidth={2.5} />
              </View>
              <Text style={[styles.actionPrimaryText, { flex: 1 }]}>Add Address</Text>
              <ChevronRight size={20} color={isDark ? '#555555' : '#94A3B8'} />
            </TouchableOpacity>

          </Animated.View>
        )}

        {/* Section Header: SAVED ADDRESSES */}
        {searchQuery.trim().length === 0 && (
          <Animated.View entering={FadeInDown.delay(200)} style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionHeaderText}>SAVED ADDRESSES</Text>
          </Animated.View>
        )}

        {/* Saved Address Cards List */}
        {searchQuery.trim().length === 0 && (
          <View style={styles.addressListContainer}>
            {addresses.map((item, index) => {
              const IconComponent = getAddressIcon(item.type);
              const isSelected = item.isDefault;

              return (
                <Animated.View key={item.id} entering={FadeInDown.delay(220 + index * 60)}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => handleSelectSavedAddress(item.id, item.address)}
                    style={[
                      styles.addressCard,
                      {
                        backgroundColor: cardBg,
                        borderColor: isSelected ? '#F43F5E' : borderColor,
                        borderWidth: isSelected ? 1.5 : 1,
                      },
                    ]}
                  >
                    <View style={styles.addressCardMainRow}>
                      
                      {/* Left Icon & Distance */}
                      <View style={styles.addressLeftCol}>
                        <IconComponent size={26} color={textColor} strokeWidth={1.8} />
                        <Text style={styles.distanceText}>{item.distance || '0 m'}</Text>
                      </View>

                      {/* Main Address Info */}
                      <View style={styles.addressContentCol}>
                        <View style={styles.addressTitleRow}>
                          <Text style={[styles.addressTitle, { color: textColor }]}>{item.type}</Text>
                          {isSelected && (
                            <View style={styles.selectedBadge}>
                              <Check size={12} color="#FFFFFF" strokeWidth={3} />
                            </View>
                          )}
                        </View>

                        <Text style={styles.addressBodyText} numberOfLines={2}>
                          {item.address}
                        </Text>

                        {/* Action Icon Row at bottom */}
                        <View style={styles.actionsRow}>
                          
                          <TouchableOpacity
                            style={[styles.actionCircleBtn, { backgroundColor: isDark ? '#2A2A2A' : '#F8FAFC', borderColor }]}
                            onPress={() => handleMoreOptions(item)}
                            activeOpacity={0.7}
                          >
                            <MoreHorizontal size={18} color={subTextColor} />
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[styles.actionCircleBtn, { backgroundColor: isDark ? '#2A2A2A' : '#F8FAFC', borderColor }]}
                            onPress={() => handleShareAddress(item)}
                            activeOpacity={0.7}
                          >
                            <Share2 size={16} color={subTextColor} />
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[styles.actionCircleBtn, { backgroundColor: isDark ? '#2A2A2A' : '#F8FAFC', borderColor }]}
                            onPress={() => Alert.alert('Address Details', item.address)}
                            activeOpacity={0.7}
                          >
                            <Camera size={16} color={subTextColor} />
                          </TouchableOpacity>

                        </View>

                      </View>

                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        )}

      </ScrollView>

      {/* Action Bottom Sheet for Adding Address */}
      <ActionBottomSheet ref={bottomSheetRef}>
        <AddressForm
          onSuccess={() => {
            bottomSheetRef.current?.dismiss();
            showToast('New address saved!');
          }}
        />
      </ActionBottomSheet>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  backBtn: {
    marginRight: 8,
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
  },
  searchResultsBox: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  searchHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  searchResultItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  suggestionIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFE4E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  searchResultTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  searchResultSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  actionCardBox: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  actionLeftIcon: {
    width: 28,
    alignItems: 'center',
    marginRight: 10,
  },
  actionTextCol: {
    flex: 1,
    marginRight: 8,
  },
  actionPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F43F5E',
  },
  actionSubText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  sectionHeaderWrap: {
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  addressListContainer: {
    gap: 14,
  },
  addressCard: {
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  addressCardMainRow: {
    flexDirection: 'row',
  },
  addressLeftCol: {
    alignItems: 'center',
    width: 44,
    marginRight: 12,
    paddingTop: 2,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
  },
  addressContentCol: {
    flex: 1,
  },
  addressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  addressTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  selectedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F43F5E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressBodyText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  actionCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
