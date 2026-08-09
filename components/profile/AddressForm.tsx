import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAddressStore } from '@/hooks/useAddressStore';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { MapPin, Navigation } from 'lucide-react-native';

interface AddressFormProps {
  onSuccess: () => void;
}

export default function AddressForm({ onSuccess }: AddressFormProps) {
  const { colors, isDark } = useTheme();
  const addAddress = useAddressStore((state) => state.addAddress);

  const [type, setType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [addressLine, setAddressLine] = useState('');
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    // Default location (e.g., somewhere central if location permission fails)
    setLocation({ latitude: 12.9716, longitude: 77.5946 }); 
  }, []);

  const handleGetCurrentLocation = async () => {
    setLoadingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoadingLocation(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      
      // Reverse geocode to get a readable address (simplified for demo)
      let geocode = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      if (geocode && geocode.length > 0) {
        const place = geocode[0];
        setAddressLine(`${place.street || place.name}, ${place.city}, ${place.region}`);
      }
    } catch (error) {
      console.warn(error);
    }
    setLoadingLocation(false);
  };

  const [flatNo, setFlatNo] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    if (!addressLine) return;
    const fullAddressStr = [flatNo, addressLine, landmark, pincode].filter(Boolean).join(', ');
    addAddress({
      type,
      address: fullAddressStr || addressLine,
      flatNo,
      landmark,
      pincode,
      phone,
      isDefault: false,
      latitude: location?.latitude,
      longitude: location?.longitude,
    });
    Keyboard.dismiss();
    onSuccess();
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Add New Address</Text>

      {/* Mini Map */}
      <View style={[styles.mapContainer, { borderColor: isDark ? '#333' : '#E5E5E5' }]}>
        {location && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={location}>
              <View style={[styles.markerWrap, { backgroundColor: colors.accent }]}>
                <MapPin size={16} color="#FFF" />
              </View>
            </Marker>
          </MapView>
        )}
        <TouchableOpacity 
          style={[styles.locationBtn, { backgroundColor: colors.background }]}
          onPress={handleGetCurrentLocation}
        >
          <Navigation size={20} color={colors.accent} />
          <Text style={[styles.locationText, { color: colors.text }]}>
            {loadingLocation ? 'Locating...' : 'Use Current Location'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['Home', 'Work', 'Other'].map((t) => (
          <TouchableOpacity 
            key={t}
            style={[styles.tab, type === t && { backgroundColor: colors.background }]} 
            onPress={() => setType(t as any)}
          >
            <Text style={[styles.tabText, { color: type === t ? colors.text : colors.textMuted }]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.formGroupRow}>
        <View style={[styles.smallInputWrap, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}>
          <TextInput
            style={[styles.singleInput, { color: colors.text }]}
            placeholder="Flat / House / Building No"
            placeholderTextColor={colors.textMuted}
            value={flatNo}
            onChangeText={setFlatNo}
          />
        </View>
      </View>

      <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Street Address / Area / Locality"
          placeholderTextColor={colors.textMuted}
          value={addressLine}
          onChangeText={setAddressLine}
          multiline
        />
      </View>

      <View style={styles.formGroupRow}>
        <View style={[styles.smallInputWrap, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5', flex: 1, marginRight: 8 }]}>
          <TextInput
            style={[styles.singleInput, { color: colors.text }]}
            placeholder="Landmark (Optional)"
            placeholderTextColor={colors.textMuted}
            value={landmark}
            onChangeText={setLandmark}
          />
        </View>

        <View style={[styles.smallInputWrap, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5', width: 120 }]}>
          <TextInput
            style={[styles.singleInput, { color: colors.text }]}
            placeholder="Pincode"
            placeholderTextColor={colors.textMuted}
            value={pincode}
            onChangeText={setPincode}
            keyboardType="numeric"
            maxLength={6}
          />
        </View>
      </View>

      <View style={[styles.smallInputWrap, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5', marginBottom: 20 }]}>
        <TextInput
          style={[styles.singleInput, { color: colors.text }]}
          placeholder="Receiver Phone Number"
          placeholderTextColor={colors.textMuted}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: colors.accent, opacity: addressLine ? 1 : 0.5 }]}
        onPress={handleSubmit}
        disabled={!addressLine}
      >
        <Text style={styles.submitText}>Save Address</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 20, letterSpacing: -0.5 },
  mapContainer: {
    height: 180,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 24,
    position: 'relative',
  },
  map: { width: '100%', height: '100%' },
  markerWrap: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  locationBtn: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  locationText: { fontSize: 14, fontWeight: '700' },
  tabContainer: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(0,0,0,0.05)', 
    borderRadius: 16, 
    padding: 4, 
    marginBottom: 20 
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  tabText: { fontSize: 15, fontWeight: '700' },
  inputWrapper: { borderRadius: 16, padding: 4, marginBottom: 12 },
  input: { 
    minHeight: 80, 
    paddingHorizontal: 16, 
    paddingTop: 14,
    fontSize: 15,
    fontWeight: '500',
    textAlignVertical: 'top'
  },
  formGroupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  smallInputWrap: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  singleInput: {
    fontSize: 14.5,
    fontWeight: '500',
  },
  submitButton: { height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  submitText: { color: '#FFF', fontSize: 17, fontWeight: '700' }
});
