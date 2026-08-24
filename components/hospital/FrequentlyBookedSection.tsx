import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Modal, Pressable } from 'react-native';
import { ChevronRight, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';

export interface FrequentlyBookedItem {
  id: string;
  title: string;
  price: string;
  image: string;
  type: string;
  description?: string;
}

interface Props {
  items?: FrequentlyBookedItem[];
  title?: string;
  onItemPress?: (item: FrequentlyBookedItem) => void;
}

const FREQUENTLY_BOOKED_ITEMS: FrequentlyBookedItem[] = [
  {
    id: 'fb-1',
    title: 'Cardiology Consultation',
    price: '₹800',
    image: 'https://cdn-icons-png.flaticon.com/512/2864/2864350.png',
    type: 'consultation',
    description: 'Direct consultation with our senior cardiologist. Ideal for cardiovascular checks, symptoms like chest tightness, high blood pressure, or general heart care.',
  },
  {
    id: 'fb-2',
    title: 'ECG + Consultation',
    price: '₹1,200',
    image: 'https://cdn-icons-png.flaticon.com/512/3004/3004458.png',
    type: 'consultation',
    description: 'Get an Electrocardiogram (ECG) to monitor your heart\'s electrical activity, followed by a detailed review and medical consultation with a specialist.',
  },
  {
    id: 'fb-3',
    title: 'Heart Health Check',
    price: '₹1,500',
    image: 'https://cdn-icons-png.flaticon.com/512/865/865969.png',
    type: 'package',
    description: 'A comprehensive preventive cardiac screening package. Includes ECG, sugar test, cholesterol profile, and a cardiologist consultation.',
  },
];

export default function FrequentlyBookedSection({ items, title = 'Frequently booked together', onItemPress }: Props) {
  const { colors, isDark } = useTheme();
  const [selectedDetailsItem, setSelectedDetailsItem] = useState<FrequentlyBookedItem | null>(null);

  const displayItems = items && items.length > 0 ? items : FREQUENTLY_BOOKED_ITEMS;

  const handleOpenDetails = (item: FrequentlyBookedItem) => {
    setSelectedDetailsItem(item);
  };

  const handleCloseDetails = () => {
    setSelectedDetailsItem(null);
  };

  const handleAddPress = (item: FrequentlyBookedItem) => {
    if (onItemPress) {
      onItemPress(item);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {title}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {displayItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card,
              {
                backgroundColor: isDark ? '#1E1E24' : '#FFFFFF',
                borderColor: isDark ? '#27272A' : '#F1F5F9',
              },
            ]}
            onPress={() => handleOpenDetails(item)}
            activeOpacity={0.85}
          >
            {/* Top Row: Image Icon and Price next to each other */}
            <View style={styles.topRow}>
              <View
                style={[
                  styles.imageWrapper,
                  { backgroundColor: isDark ? '#2A2A32' : '#F8FAFC' },
                ]}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.illustrationImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.priceText, { color: colors.text }]}>
                {item.price}
              </Text>
            </View>

            {/* Middle Section: Title (max 2 lines) */}
            <Text style={[styles.itemTitle, { color: isDark ? '#E2E8F0' : '#1E293B' }]} numberOfLines={2}>
              {item.title}
            </Text>

            {/* Bottom Row: View Details Link & ADD Button */}
            <View style={styles.bottomRow}>
              <TouchableOpacity
                style={styles.linkRow}
                onPress={() => handleOpenDetails(item)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.linkText}>Details</Text>
                <ChevronRight size={11} color="#E11D48" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.addBtn,
                  { backgroundColor: isDark ? '#2D1B28' : '#FFF5F7' }
                ]}
                onPress={() => handleAddPress(item)}
                activeOpacity={0.8}
              >
                <Text style={styles.addBtnText}>ADD</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Service Details Modal */}
      {selectedDetailsItem && (
        <Modal
          visible={!!selectedDetailsItem}
          transparent={true}
          animationType="slide"
          onRequestClose={handleCloseDetails}
        >
          <Pressable style={styles.modalOverlay} onPress={handleCloseDetails}>
            <Pressable
              style={[styles.modalCard, { backgroundColor: isDark ? '#1C1929' : '#FFFFFF' }]}
              onPress={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Service Details</Text>
                <TouchableOpacity onPress={handleCloseDetails} style={styles.closeBtn}>
                  <X size={20} color={colors.text} />
                </TouchableOpacity>
              </View>

              {/* Modal Content */}
              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 300 }}>
                <View style={styles.modalContentWrapper}>
                  {/* Large Icon Graphic */}
                  <View style={[styles.modalImageWrapper, { backgroundColor: isDark ? '#2A1F3D' : '#F3E8FF' }]}>
                    <Image
                      source={{ uri: selectedDetailsItem.image }}
                      style={styles.modalIllustrationImage}
                      resizeMode="contain"
                    />
                  </View>

                  <Text style={[styles.modalItemTitle, { color: colors.text }]}>
                    {selectedDetailsItem.title}
                  </Text>

                  <Text style={[styles.modalPriceText, { color: '#E11D48' }]}>
                    {selectedDetailsItem.price}
                  </Text>

                  <Text style={[styles.modalDescText, { color: isDark ? '#CBD5E1' : '#475569' }]}>
                    {selectedDetailsItem.description}
                  </Text>
                </View>
              </ScrollView>

              {/* Action Button: Book/Add */}
              <TouchableOpacity
                style={styles.modalActionBtn}
                onPress={() => {
                  const item = selectedDetailsItem;
                  handleCloseDetails();
                  handleAddPress(item);
                }}
                activeOpacity={0.88}
              >
                <Text style={styles.modalActionText}>BOOK APPOINTMENT</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 15.5,
    fontWeight: '600',
    paddingHorizontal: 16,
    marginBottom: 10,
    letterSpacing: -0.15,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 135,
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 146,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  imageWrapper: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  priceText: {
    fontFamily: Fonts.bold,
    fontSize: 14.5,
    fontWeight: '700',
  },
  itemTitle: {
    fontFamily: Fonts.medium,
    fontSize: 11.5,
    fontWeight: '500',
    lineHeight: 15,
    height: 30,
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  linkText: {
    fontFamily: Fonts.semiBold,
    fontSize: 10.5,
    fontWeight: '600',
    color: '#E11D48',
  },
  addBtn: {
    width: 48,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    fontWeight: '800',
    color: '#E11D48',
    letterSpacing: 0.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    fontWeight: '600',
  },
  closeBtn: {
    padding: 4,
  },
  modalContentWrapper: {
    alignItems: 'center',
    paddingBottom: 12,
  },
  modalImageWrapper: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    padding: 12,
  },
  modalIllustrationImage: {
    width: '100%',
    height: '100%',
  },
  modalItemTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  modalPriceText: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalDescText: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    fontWeight: '400',
  },
  modalActionBtn: {
    backgroundColor: '#E11D48',
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modalActionText: {
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

