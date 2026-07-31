import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PartnerHeader } from '../../components/PartnerHeader';
import { PackageManagementCard } from '../../components/PackageManagementCard';
import { usePartnerStore } from '../../hooks/usePartnerStore';
import { useTheme } from '../../hooks/useTheme';

export default function PartnerListingsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { packages } = usePartnerStore();

  const handleAddNew = () => {
    Alert.alert('Add Package Listing', 'Custom health package creator wizard will open here.');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <PartnerHeader />

      <View style={[styles.topHeader, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <View style={styles.headerTitleGroup}>
          <Text style={[styles.pageTitle, { color: colors.text }]}>Package & Service Listings</Text>
          <Text style={styles.pageSub}>Manage partner pricing, active checkups & offers</Text>
        </View>
        <Pressable onPress={handleAddNew} style={styles.addBtn}>
          <Ionicons name="add" size={18} color="#FFFFFF" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Live Published Packages ({packages.length})</Text>

        {packages.map((pkg) => (
          <PackageManagementCard key={pkg.id} item={pkg} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleGroup: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  pageSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  addBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 6,
  },
});
