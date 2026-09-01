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
  const [flatNo, setFlatNo] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);

  const handleGetCurrentLocation = () => {
    setLoadingLocation(true);
    if (typeof window !== 'undefined' && window.navigator?.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLoadingLocation(false);
          setAddressLine('Banjara Hills, Road No. 12, Hyderabad');
        },
        () => setLoadingLocation(false),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setLoadingLocation(false);
    }
  };

  const handleSubmit = () => {
    const combinedAddress = [flatNo, addressLine, landmark, pincode ? `PIN: ${pincode}` : ''].filter(Boolean).join(', ');
    if (!combinedAddress && !addressLine && !flatNo) return;

    addAddress({
      type,
      address: combinedAddress || addressLine || flatNo || 'Saved Address',
      flatNo,
      landmark,
      pincode,
      phone,
      isDefault: false,
    });
    Keyboard.dismiss();
    onSuccess();
  };

  const canSubmit = Boolean(addressLine.trim() || flatNo.trim());

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Add New Address</Text>

      <View style={[styles.mapFallback, { borderColor: isDark ? '#333' : '#E5E5E5', backgroundColor: isDark ? '#202226' : '#F5F8FC' }]}>
        <View style={[styles.pinWrap, { backgroundColor: colors.accent }]}>
          <MapPin size={22} color="#FFFFFF" />
        </View>
        <TouchableOpacity style={[styles.locationBtn, { backgroundColor: colors.background }]} onPress={handleGetCurrentLocation}>
          <Navigation size={18} color={colors.accent} />
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

      <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5', marginBottom: 12 }]}>
        <TextInput
          style={[styles.inputSingle, { color: colors.text }]}
          placeholder="Flat / House / Building No."
          placeholderTextColor={colors.textMuted}
          value={flatNo}
          onChangeText={setFlatNo}
        />
      </View>

      <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5', marginBottom: 12 }]}>
        <TextInput
          style={[styles.inputMulti, { color: colors.text }]}
          placeholder="Street Address / Area / Locality"
          placeholderTextColor={colors.textMuted}
          value={addressLine}
          onChangeText={setAddressLine}
          multiline
        />
      </View>

      <View style={styles.rowInputs}>
        <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5', flex: 1 }]}>
          <TextInput
            style={[styles.inputSingle, { color: colors.text }]}
            placeholder="Landmark (Optional)"
            placeholderTextColor={colors.textMuted}
            value={landmark}
            onChangeText={setLandmark}
          />
        </View>

        <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5', width: 130 }]}>
          <TextInput
            style={[styles.inputSingle, { color: colors.text }]}
            placeholder="Pincode"
            placeholderTextColor={colors.textMuted}
            value={pincode}
            onChangeText={setPincode}
            maxLength={6}
          />
        </View>
      </View>

      <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5', marginBottom: 20 }]}>
        <TextInput
          style={[styles.inputSingle, { color: colors.text }]}
          placeholder="Contact Phone Number"
          placeholderTextColor={colors.textMuted}
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: colors.accent, opacity: canSubmit ? 1 : 0.5 }]}
        onPress={handleSubmit}
        disabled={!canSubmit}
      >
        <Text style={styles.submitText}>Save Address</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 20, letterSpacing: -0.5 },
  mapFallback: {
    height: 160,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  pinWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    gap: 6,
  },
  locationText: { fontSize: 13.5, fontWeight: '700' },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 18,
  },
  tab: { flex: 1, paddingVertical: 11, alignItems: 'center', borderRadius: 12 },
  tabText: { fontSize: 14, fontWeight: '700' },
  inputWrapper: { borderRadius: 14, paddingHorizontal: 14, paddingVertical: 4 },
  inputSingle: {
    height: 46,
    fontSize: 14.5,
    fontWeight: '500',
  },
  inputMulti: {
    minHeight: 70,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14.5,
    fontWeight: '500',
    textAlignVertical: 'top',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  submitButton: { height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  submitText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
});

