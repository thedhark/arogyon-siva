import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  Share as RNShare 
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useBookingStore } from '@/hooks/useBookingStore';
import { useProfileStore } from '@/hooks/useProfileStore';
import Animated, { FadeInDown } from 'react-native-reanimated';

import PackageHeroBanner from '@/components/packages/detail/PackageHeroBanner';
import PackagePricingCard from '@/components/packages/detail/PackagePricingCard';
import PackageFeaturesGrid from '@/components/packages/detail/PackageFeaturesGrid';
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
  hospitalName = 'Manipal Hospital', 
  onClose, 
  onAdded 
}: AddPackageModalProps) {
  const { colors, isDark } = useTheme();
  const addCartItem = useBookingStore((state) => state.addCartItem);
  const userProfile = useProfileStore((state) => state.userProfile);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);

  // Multi-person beneficiaries for this package (No appointment dates)
  const [assignedPatients, setAssignedPatients] = useState<PatientSlotAssignment[]>([
    {
      id: 'me',
      name: userProfile?.name || 'Sridhar K.',
      relation: 'Self',
      avatar: userProfile?.avatar,
      selectedDate: '1 Year Validity',
      selectedTime: 'Anytime',
      accentColor: '#6366F1',
    },
  ]);

  if (!packageItem) return null;

  const pkgTitle = (packageItem.title || 'Health Package').replace(/^1\s*x\s*/i, '');
  const pkgSubtitle = packageItem.subtitle || packageItem.summary || 'Full-spectrum diagnostic checkup with accredited laboratory testing and senior physician consultation.';
  const pkgImage = packageItem.image || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600';
  
  const rawPriceStr = (packageItem.price || '4999').toString().replace(/[^0-9]/g, '');
  const unitPrice = parseFloat(rawPriceStr) || 4999;
  
  const rawOrigStr = (packageItem.originalPrice || '').toString().replace(/[^0-9]/g, '');
  const unitOriginalPrice = parseFloat(rawOrigStr) || Math.round(unitPrice * 1.35);

  const totalPrice = unitPrice * assignedPatients.length;
  const totalOriginalPrice = unitOriginalPrice * assignedPatients.length;
  const totalSavings = Math.max(63, totalOriginalPrice - totalPrice);

  const inclusions = packageItem.inclusions || [
    'Obstetrician / Specialist Consultations',
    'All Diagnostic Lab Tests & Scans',
    'Nutrition & Diet Guidance Plan',
    'Follow-up & Physician Support',
  ];

  const handleShare = async () => {
    try {
      await RNShare.share({
        message: `Check out ${pkgTitle} on Arogyon! Special Price: ₹${totalPrice.toLocaleString('en-IN')}`,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleRemovePerson = (patientId: string) => {
    setAssignedPatients((prev) => prev.filter((p) => p.id !== patientId));
  };

  const handleAddPerson = (newPerson: PatientSlotAssignment) => {
    setAssignedPatients((prev) => [
      ...prev,
      {
        ...newPerson,
        selectedDate: '1 Year Validity',
        selectedTime: 'Anytime',
      },
    ]);
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
      animationType="slide" 
      presentationStyle="fullScreen"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.modalContent, { backgroundColor: isDark ? '#0D0E11' : '#F8FAFC' }]}>
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

          {/* 2. Pricing Breakdown Card */}
          <Animated.View entering={FadeInDown.delay(75)}>
            <PackagePricingCard
              price={`₹${totalPrice.toLocaleString('en-IN')}`}
              originalPrice={`₹${totalOriginalPrice.toLocaleString('en-IN')}`}
              discount={`${Math.round((totalSavings / totalOriginalPrice) * 100)}% OFF`}
              tokenPrice="₹499"
            />
          </Animated.View>

          {/* 3. Assign Package Beneficiaries (People Selector - No Appointment Dates) */}
          <Animated.View entering={FadeInDown.delay(90)}>
            <PackagePersonSelectorCard
              assignedPatients={assignedPatients}
              onAddPersonPress={() => setShowAddPersonModal(true)}
              onRemovePerson={handleRemovePerson}
            />
          </Animated.View>

          {/* 4. Four Guarantees/Features Grid */}
          <Animated.View entering={FadeInDown.delay(110)}>
            <PackageFeaturesGrid isDark={isDark} style={{ marginHorizontal: 16 }} />
          </Animated.View>

          {/* 5. Accordion Content Sections Container */}
          <View style={styles.bodySectionsContainer}>
            {/* About this plan Accordion */}
            <Animated.View entering={FadeInDown.delay(125)}>
              <PackageAboutCard
                title="About this plan"
                description={pkgSubtitle}
                isDark={isDark}
                colors={colors}
              />
            </Animated.View>

            {/* What's included Accordion */}
            <Animated.View entering={FadeInDown.delay(150)}>
              <PackageInclusionsCard
                inclusions={inclusions}
                isDark={isDark}
                colors={colors}
              />
            </Animated.View>

            {/* Similar Packages Carousel */}
            <Animated.View entering={FadeInDown.delay(200)}>
              <SimilarPackagesCard
                isDark={isDark}
                colors={colors}
              />
            </Animated.View>

            {/* Important to know info card */}
            <Animated.View entering={FadeInDown.delay(250)}>
              <PackageAssessmentCard
                isDark={isDark}
                style={{ marginHorizontal: 0, marginTop: 10, marginBottom: 16 }}
              />
            </Animated.View>
          </View>
        </ScrollView>

        {/* Sticky Booking Action Bar with Dynamic Person Count */}
        <StickyBookingPaymentBar
          priceDropText="Special Health Package Offer"
          price={`₹${totalPrice.toLocaleString('en-IN')}`}
          originalPrice={`₹${totalOriginalPrice.toLocaleString('en-IN')}`}
          discountText={`${Math.round((totalSavings / totalOriginalPrice) * 100)}% OFF`}
          tokenCtaText="Reserve Slot (₹499)"
          ctaText={assignedPatients.length > 1 ? `Confirm (${assignedPatients.length} Persons)` : 'Confirm Package'}
          ctaIcon="bag"
          onPressTokenCTA={handleReserveToken}
          onPressCTA={handleConfirmAdd}
        />
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
