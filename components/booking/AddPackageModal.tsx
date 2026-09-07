import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  Share as RNShare,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useBookingStore } from '@/hooks/useBookingStore';
import { useProfileStore } from '@/hooks/useProfileStore';
import Animated, { FadeInDown } from 'react-native-reanimated';

import PackageHeroBanner from '@/components/packages/detail/PackageHeroBanner';
import PackageAssessmentCard from '@/components/packages/detail/PackageAssessmentCard';
import PackageAboutCard from '@/components/packages/detail/PackageAboutCard';
import PackageInclusionsCard from '@/components/packages/detail/PackageInclusionsCard';
import SimilarPackagesCard from '@/components/packages/detail/SimilarPackagesCard';
import StickyBookingPaymentBar from '@/components/booking/StickyBookingPaymentBar';
import PackagePersonSelectorCard from '@/components/booking/PackagePersonSelectorCard';
import SelectFamilyMemberModal from '@/components/booking/SelectFamilyMemberModal';
import { PatientSlotAssignment } from '@/components/booking/MultiPersonSlotSheet';

interface AddPackageModalProps {
  visible: boolean;
  packageItem: any;
  hospitalName?: string;
  onClose: () => void;
  onAdded?: () => void;
}

export default function AddPackageModal({ 
  visible, 
  packageItem, 
  hospitalName = 'Apollo Hospital', 
  onClose, 
  onAdded 
}: AddPackageModalProps) {
  const { colors, isDark } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && windowWidth >= 1024;
  const addCartItem = useBookingStore((state) => state.addCartItem);
  const userProfile = useProfileStore((state) => state.userProfile);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);

  // Multi-patient assignment state (Packages don't need slot dates)
  const [assignedPatients, setAssignedPatients] = useState<PatientSlotAssignment[]>([
    {
      id: 'me',
      name: userProfile?.name || 'Self',
      relation: 'Self',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250',
      selectedDate: '',
      selectedTime: '',
    },
  ]);

  if (!packageItem) return null;

  const pkgTitle = packageItem.title || 'Health Package';
  const pkgSubtitle = packageItem.subtitle || 'Comprehensive health assessment';
  const pkgImage = packageItem.image || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800';

  const unitPrice = parseInt(String(packageItem.price || '999').replace(/[^0-9]/g, ''), 10) || 999;
  const unitOriginalPrice = packageItem.originalPrice 
    ? parseInt(String(packageItem.originalPrice).replace(/[^0-9]/g, ''), 10) 
    : Math.round(unitPrice * 1.5);

  const totalPrice = unitPrice * assignedPatients.length;
  const totalOriginalPrice = unitOriginalPrice * assignedPatients.length;
  const totalSavings = totalOriginalPrice - totalPrice;

  const inclusions = packageItem.inclusions || [
    'Obstetrician / Specialist Consultations',
    'All Diagnostic Lab Tests & Scans',
    'Nutrition & Diet Guidance Plan',
    'Follow-up & Physician Support',
  ];

  const handleShare = async () => {
    try {
      await RNShare.share({
        message: `Check out ${pkgTitle} at ${hospitalName} on Arogyon!`,
        title: pkgTitle,
      });
    } catch {}
  };

  const handleRemovePerson = (patientId: string) => {
    if (assignedPatients.length <= 1) return;
    setAssignedPatients((prev) => prev.filter((p) => p.id !== patientId));
  };

  const handleAddPerson = (newPerson: PatientSlotAssignment) => {
    setAssignedPatients((prev) => [
      ...prev,
      {
        id: newPerson.id,
        name: newPerson.name,
        relation: newPerson.relation,
        avatar: newPerson.avatar,
        selectedDate: '',
        selectedTime: '',
      },
    ]);
    setShowAddPersonModal(false);
  };

  const handleReserveToken = () => {
    assignedPatients.forEach((patient, idx) => {
      addCartItem({
        type: 'package',
        itemId: `${packageItem.id || 'pkg'}-${patient.id}-${Date.now()}-${idx}`,
        title: pkgTitle,
        subtitle: `${packageItem.category || 'Package'} • Slot Reservation`,
        price: 499,
        originalPrice: unitPrice,
        savingsAmount: Math.max(0, unitPrice - 499),
        image: pkgImage,
        hospitalName: hospitalName,
        assignedPatientId: patient.id,
        assignedPatientName: patient.name,
        assignedPatientRelation: patient.relation,
        assignedPatientAvatar: patient.avatar,
      });
    });

    onClose();
    if (onAdded) onAdded();
  };

  const handleConfirmAdd = () => {
    assignedPatients.forEach((patient, idx) => {
      addCartItem({
        type: 'package',
        itemId: `${packageItem.id || 'pkg'}-${patient.id}-${Date.now()}-${idx}`,
        title: pkgTitle,
        subtitle: `${packageItem.category || 'Package'} • Health Package`,
        price: unitPrice,
        originalPrice: unitOriginalPrice,
        savingsAmount: Math.max(0, unitOriginalPrice - unitPrice),
        image: pkgImage,
        hospitalName: hospitalName,
        assignedPatientId: patient.id,
        assignedPatientName: patient.name,
        assignedPatientRelation: patient.relation,
        assignedPatientAvatar: patient.avatar,
      });
    });

    onClose();
    if (onAdded) onAdded();
  };

  return (
    <Modal 
      visible={visible} 
      animationType={Platform.OS === 'web' ? 'fade' : 'slide'} 
      transparent={Platform.OS === 'web'}
      presentationStyle={Platform.OS === 'web' ? 'overFullScreen' : 'fullScreen'}
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.modalRoot, Platform.OS === 'web' && styles.webModalRoot]}>
        {/* On Web: Backdrop click outside middle column closes modal */}
        {Platform.OS === 'web' && (
          <TouchableOpacity
            style={styles.webBackdrop}
            activeOpacity={1}
            onPress={onClose}
          />
        )}

        <View
          style={[
            styles.modalContent,
            { backgroundColor: isDark ? '#0D0E11' : '#F8FAFC' },
            Platform.OS === 'web' && (
              isDesktopWeb
                ? {
                    position: 'absolute' as any,
                    left: 260,
                    right: 350,
                    top: 0,
                    bottom: 0,
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                    borderLeftColor: isDark ? '#262626' : '#E2E8F0',
                    borderRightColor: isDark ? '#262626' : '#E2E8F0',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                  }
                : {
                    width: '100%',
                    maxWidth: 620,
                    height: '100%',
                    alignSelf: 'center',
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                    borderLeftColor: isDark ? '#262626' : '#E2E8F0',
                    borderRightColor: isDark ? '#262626' : '#E2E8F0',
                  }
            ),
          ]}
        >
        {/* Full Package Details View Content inside ScrollView */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>
          {/* 1. Package Hero Image Banner */}
          <Animated.View entering={FadeInDown.delay(50)}>
            <PackageHeroBanner
              image={pkgImage}
              title={pkgTitle}
              subtitle={pkgSubtitle}
              hospitalName={hospitalName}
              isDark={isDark}
              colors={colors}
              onBackPress={onClose}
              onSharePress={handleShare}
              onBookmarkPress={() => setIsBookmarked(!isBookmarked)}
              isBookmarked={isBookmarked}
            />
          </Animated.View>

          {/* 2. Content Sections Container */}
          <View style={styles.bodySectionsContainer}>
            {/* About this plan Accordion */}
            <Animated.View entering={FadeInDown.delay(100)}>
              <PackageAboutCard
                title="About this plan"
                description={pkgSubtitle}
                isDark={isDark}
                colors={colors}
              />
            </Animated.View>

            {/* What's included Accordion */}
            <Animated.View entering={FadeInDown.delay(125)}>
              <PackageInclusionsCard
                inclusions={inclusions}
                isDark={isDark}
                colors={colors}
              />
            </Animated.View>

            {/* Similar Packages Carousel */}
            <Animated.View entering={FadeInDown.delay(150)}>
              <SimilarPackagesCard
                isDark={isDark}
                colors={colors}
              />
            </Animated.View>

            {/* Who is this package for? (Beneficiary Selector below Similar Packages) */}
            <Animated.View entering={FadeInDown.delay(175)}>
              <PackagePersonSelectorCard
                assignedPatients={assignedPatients}
                onAddPersonPress={() => setShowAddPersonModal(true)}
                onRemovePerson={handleRemovePerson}
                style={{ marginHorizontal: 0, marginTop: 12, marginBottom: 16 }}
              />
            </Animated.View>

            {/* Important to know info card */}
            <Animated.View entering={FadeInDown.delay(200)}>
              <PackageAssessmentCard
                isDark={isDark}
                style={{ marginHorizontal: 0, marginTop: 4, marginBottom: 16 }}
              />
            </Animated.View>
          </View>
        </ScrollView>

        {/* Sticky Booking Action Bar with Package Price on Left & Confirm Package on Right */}
        <StickyBookingPaymentBar
          priceDropText="Special Health Package Offer"
          price={`₹${totalPrice.toLocaleString('en-IN')}`}
          originalPrice={`₹${totalOriginalPrice.toLocaleString('en-IN')}`}
          discountText={`${Math.round((totalSavings / totalOriginalPrice) * 100)}% OFF`}
          ctaText={assignedPatients.length > 1 ? `Confirm (${assignedPatients.length} Persons)` : 'Confirm Package'}
          ctaIcon="bag"
          onPressCTA={handleConfirmAdd}
        />
        </View>
      </View>

      {/* Select Family Member Sheet */}
      <SelectFamilyMemberModal
        visible={showAddPersonModal}
        alreadySelectedIds={assignedPatients.map((p) => p.id)}
        onClose={() => setShowAddPersonModal(false)}
        onSelectMember={handleAddPerson}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  webModalRoot: {
    position: 'fixed' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  webBackdrop: {
    position: 'absolute' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 130,
  },
  bodySectionsContainer: {
    paddingHorizontal: 16,
    marginTop: 4,
  },
});
