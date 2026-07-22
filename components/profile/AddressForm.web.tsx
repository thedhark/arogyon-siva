import React, { useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MapPin, Navigation } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAddressStore } from '@/hooks/useAddressStore';

interface AddressFormProps {
  onSuccess: () => void;
}

export default function AddressForm({ onSuccess }: AddressFormProps) {
  const { colors, isDark } = useTheme();
  const addAddress = useAddressStore((state) => state.addAddress);

  const [type, setType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [addressLine, setAddressLine] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);

  const handleGetCurrentLocation = () => {
    setLoadingLocation(true);
    window.navigator.geolocation?.getCurrentPosition(
      () => setLoadingLocation(false),
      () => setLoadingLocation(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSubmit = () => {
    if (!addressLine) return;

    addAddress({
      type,
      address: addressLine,
      isDefault: false,
    });
    Keyboard.dismiss();
    onSuccess();
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Add New Address</Text>

      <View style={[styles.mapFallback, { borderColor: isDark ? '#333' : '#E5E5E5', backgroundColor: isDark ? '#202226' : '#F5F8FC' }]}>
        <View style={[styles.pinWrap, { backgroundColor: colors.accent }]}>
          <MapPin size={22} color="#FFFFFF" />
        </View>
        <TouchableOpacity style={[styles.locationBtn, { backgroundColor: colors.background }]} onPress={handleGetCurrentLocation}>
          <Navigation size={20} color={colors.accent} />
          <Text style={[styles.locationText, { color: colors.text }]}>
            {loadingLocation ? 'Locating...' : 'Use Current Location'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        {['Home', 'Work', 'Other'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, type === tab && { backgroundColor: colors.background }]}
            onPress={() => setType(tab as 'Home' | 'Work' | 'Other')}
          >
            <Text style={[styles.tabText, { color: type === tab ? colors.text : colors.textMuted }]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Complete Address (House No, Street, City)"
          placeholderTextColor={colors.textMuted}
          value={addressLine}
          onChangeText={setAddressLine}
          multiline
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
  title: { fontSize: 24, fontWeight: '800', marginBottom: 20, letterSpacing: 0 },
  mapFallback: {
    height: 180,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  pinWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)',
  },
  locationText: { fontSize: 14, fontWeight: '700' },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  tabText: { fontSize: 15, fontWeight: '700' },
  inputWrapper: { borderRadius: 16, padding: 4, marginBottom: 24 },
  input: {
    minHeight: 100,
    paddingHorizontal: 16,
    paddingTop: 16,
    fontSize: 16,
    fontWeight: '500',
    textAlignVertical: 'top',
  },
  submitButton: { height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  submitText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
});
