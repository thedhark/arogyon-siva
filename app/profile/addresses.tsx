import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import { ChevronLeft, Plus, MapPin, Home, Briefcase, Trash2, Map } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAddressStore } from '@/hooks/useAddressStore';
import { ActionBottomSheet, ActionBottomSheetRef } from '@/components/ActionBottomSheet';
import AddressForm from '@/components/profile/AddressForm';

export default function AddressesScreen() {
  const { colors, isDark } = useTheme();
  
  const addresses = useAddressStore((state) => state.addresses);
  const setDefaultAddress = useAddressStore((state) => state.setDefaultAddress);
  const removeAddress = useAddressStore((state) => state.removeAddress);
  const bottomSheetRef = useRef<ActionBottomSheetRef>(null);

  const getIcon = (type: string) => {
    if (type === 'Home') return Home;
    if (type === 'Work') return Briefcase;
    return Map;
  };

  const handleDelete = (id: string, type: string) => {
    Alert.alert(
      'Remove Address',
      `Are you sure you want to delete this ${type} address?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeAddress(id) }
      ]
    );
  };

  return (
    <AnimatedScreen entrance="fade">
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={28} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Saved Addresses</Text>
          <Pressable style={styles.addButton} onPress={() => bottomSheetRef.current?.present()}>
            <Plus size={24} color={colors.accent} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Manage your saved addresses for medicine delivery and home blood sample collection.
            </Text>
          </Animated.View>

          <View style={styles.list}>
            {addresses.map((item, index) => {
              const Icon = getIcon(item.type);
              return (
                <Animated.View key={item.id} entering={FadeInDown.delay(200 + index * 50)}>
                  <Pressable 
                    style={[
                      styles.card, 
                      { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: item.isDefault ? colors.accent : (isDark ? '#333' : '#F0F0F0') },
                      item.isDefault && { borderWidth: 2 }
                    ]}
                    onPress={() => setDefaultAddress(item.id)}
                  >
                    
                    <View style={styles.cardHeader}>
                      <View style={styles.titleRow}>
                        <View style={[styles.iconWrap, { backgroundColor: colors.accent + '15' }]}>
                          <Icon size={20} color={colors.accent} />
                        </View>
                        <Text style={[styles.typeText, { color: colors.text }]}>{item.type}</Text>
                        {item.isDefault && (
                          <View style={[styles.defaultBadge, { backgroundColor: colors.accent }]}>
                            <Text style={styles.defaultText}>DEFAULT</Text>
                          </View>
                        )}
                      </View>
                      
                      <TouchableOpacity 
                        style={styles.optionsButton} 
                        onPress={() => handleDelete(item.id, item.type)}
                      >
                        <Trash2 size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>

                    <Text style={[styles.addressText, { color: colors.textSecondary }]}>
                      {item.address}
                    </Text>
                    
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
          
          <Animated.View entering={FadeInDown.delay(400)}>
            <Pressable 
              style={[styles.addCard, { borderColor: colors.accent, borderStyle: 'dashed' }]}
              onPress={() => bottomSheetRef.current?.present()}
            >
              <View style={[styles.addIconWrap, { backgroundColor: colors.accent + '15' }]}>
                <MapPin size={24} color={colors.accent} />
              </View>
              <Text style={[styles.addText, { color: colors.accent }]}>Add New Address</Text>
            </Pressable>
          </Animated.View>

        </ScrollView>
      </View>

      <ActionBottomSheet ref={bottomSheetRef} snapPoints={['88%']}>
        <AddressForm onSuccess={() => bottomSheetRef.current?.dismiss()} />
      </ActionBottomSheet>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '600' },
  addButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 24, paddingBottom: 100 },
  header: { marginBottom: 24 },
  subtitle: { fontSize: 15, lineHeight: 22 },
  list: { gap: 16, marginBottom: 16 },
  card: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  typeText: { fontSize: 16, fontWeight: '700' },
  defaultBadge: { marginLeft: 12, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  defaultText: { fontSize: 10, fontWeight: '800', color: '#FFF' },
  optionsButton: { padding: 6 },
  addressText: { fontSize: 14, lineHeight: 22 },
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 2,
    height: 72,
  },
  addIconWrap: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  addText: { fontSize: 16, fontWeight: '700' }
});

