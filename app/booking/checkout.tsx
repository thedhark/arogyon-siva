import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Tag,
  Edit,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useBookingStore, CartItem } from '@/hooks/useBookingStore';
import { useProfileStore } from '@/hooks/useProfileStore';

import PaymentGatewayModal, { PaymentDetails } from '@/components/booking/PaymentGatewayModal';
import CouponOverlay from '@/components/packages/CouponOverlay';
import StickyBookingPaymentBar from '@/components/booking/StickyBookingPaymentBar';
import { useScrollFooter } from '@/hooks/useScrollFooter';
import AddOnPackageCard from '@/components/packages/cards/AddOnPackageCard';
import { PackageItem, getAddOnScreeningPackages } from '@/constants/package-data';

import AppointmentItemCard, { AppointmentItem, AssignedPatient } from '@/components/booking/AppointmentItemCard';
import WhoIsAppointmentForModal, { FamilyMemberItem } from '@/components/booking/WhoIsAppointmentForModal';
import AddFamilyMemberModal, { NewFamilyMemberPayload } from '@/components/booking/AddFamilyMemberModal';
import MemberAddedSuccessModal from '@/components/booking/MemberAddedSuccessModal';

export default function CheckoutScreen() {
  const router = useRouter();
  const { type, doctorId, date, time } = useLocalSearchParams();
  const { colors, isDark } = useTheme();

  const getDoctor = useBookingStore(state => state.getDoctor);
  const getHospital = useBookingStore(state => state.getHospital);
  const bookAppointment = useBookingStore(state => state.bookAppointment);
  const bookPackage = useBookingStore(state => state.bookPackage);

  const userProfile = useProfileStore(state => state.userProfile);
  const profileFamilyMembers = useProfileStore(state => state.familyMembers);
  const addProfileFamilyMember = useProfileStore(state => state.addFamilyMember);

  const cartItems = useBookingStore(state => state.cartItems);
  const removeCartItem = useBookingStore(state => state.removeCartItem);
  const updateCartItemPatient = useBookingStore(state => state.updateCartItemPatient);
  const clearCart = useBookingStore(state => state.clearCart);

  const addOnPackages = getAddOnScreeningPackages();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCouponOverlay, setShowCouponOverlay] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<PackageItem[]>([]);
  const [addOnPatients, setAddOnPatients] = useState<Record<string, FamilyMemberItem>>({});

  // Modal Flow States
  const [activeAssigningCartItemId, setActiveAssigningCartItemId] = useState<string | null>(null);
  const [showWhoIsForModal, setShowWhoIsForModal] = useState<boolean>(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [lastAddedMember, setLastAddedMember] = useState<{ name: string; gender: string } | null>(null);

  const [selectedDate, setSelectedDate] = useState<string>((date as string) || 'Tue, 11 Aug 2025');
  const [selectedTime, setSelectedTime] = useState<string>((time as string) || '10:00 AM');

  const { isFooterVisible, scrollProps } = useScrollFooter({ threshold: 12, topThreshold: 30 });

  // Build full family members list including self
  const selfMember: FamilyMemberItem = {
    id: 'self-1',
    name: userProfile.name || 'John Doe',
    relation: 'Self',
    age: userProfile.age || 28,
    gender: userProfile.gender || 'Male',
    avatar: userProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
  };

  const allFamilyMembers: FamilyMemberItem[] = [
    selfMember,
    ...profileFamilyMembers.map(m => ({
      id: m.id,
      name: m.name,
      relation: m.relation,
      age: m.age,
      gender: m.gender,
      avatar: m.avatar,
    }))
  ];

  // Mock initial appointments matching design reference if cart is empty
  const defaultDoc = getDoctor((doctorId as string) || 'doc-1') || {
    id: 'doc-1',
    name: 'Dr. Ramesh Verma',
    speciality: 'Cardiologist',
    location: 'Apollo Hospitals',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800',
    fee: '800',
  };

  const defaultCartDisplayItems: AppointmentItem[] = cartItems.length > 0
    ? cartItems.map((ci) => ({
        id: ci.id,
        title: ci.title,
        subtitle: ci.subtitle || 'In-Clinic Visit',
        price: ci.price,
        image: ci.image,
        dateStr: ci.selectedDate || 'Today, Aug 11',
        timeStr: ci.selectedTime || '10:00 AM',
        badgeStyle: ci.assignedPatientGender?.toLowerCase() === 'female' ? 'pink' : 'teal',
        patient: {
          id: ci.assignedPatientId || 'self-1',
          name: ci.assignedPatientName || userProfile.name || 'John Doe',
          relation: ci.assignedPatientRelation || 'Self',
          age: ci.assignedPatientAge || userProfile.age || 28,
          gender: ci.assignedPatientGender || userProfile.gender || 'Male',
          avatar: ci.assignedPatientAvatar || userProfile.avatar,
        }
      }))
    : [
        {
          id: 'mock-1',
          title: defaultDoc.name || 'Dr. Ramesh Verma',
          subtitle: `${defaultDoc.speciality || 'Cardiologist'} • In-Clinic Visit`,
          price: parseInt(defaultDoc.fee || '800', 10),
          image: defaultDoc.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800',
          dateStr: 'Today, Aug 11',
          timeStr: '10:00 AM',
          badgeStyle: 'teal',
          patient: {
            id: 'self-1',
            name: 'John Doe',
            relation: 'Self',
            age: 28,
            gender: 'Male',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
          }
        },
        {
          id: 'mock-2',
          title: 'Complete Maternity Care Package',
          subtitle: 'Pregnancy Care • Slot Reservation',
          price: 499,
          image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800',
          dateStr: 'Today, Aug 11',
          timeStr: '08:00 AM (Fasting)',
          badgeStyle: 'pink',
          patient: {
            id: 'f1',
            name: 'Ananya Doe',
            relation: 'Spouse',
            age: 26,
            gender: 'Female',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
          }
        }
      ];

  const [appointmentItems, setAppointmentItems] = useState<AppointmentItem[]>(defaultCartDisplayItems);

  // Financial Calculations
  const consultationFee = appointmentItems.reduce((acc, item) => acc + item.price, 0);
  const platformFee = consultationFee > 0 ? 20 : 0;
  const taxes = Math.round(consultationFee * 0.05);
  const addOnsTotal = selectedAddOns.reduce((sum, p) => sum + (parseInt(p.price.replace(/[^0-9]/g, '')) || 0), 0);
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const totalPayable = Math.max(0, consultationFee + platformFee + taxes + addOnsTotal - discount);

  const toggleAddOn = (pkg: PackageItem) => {
    if (selectedAddOns.some(p => p.id === pkg.id)) {
      setSelectedAddOns(prev => prev.filter(p => p.id !== pkg.id));
    } else {
      setSelectedAddOns(prev => [...prev, pkg]);
    }
  };

  const handleApplyCoupon = (code: string) => {
    let disc = 50;
    if (code.toUpperCase() === 'AROGYON50') disc = 50;
    else if (code.toUpperCase() === 'HEALTH10') disc = Math.round(consultationFee * 0.1);
    else if (code.toUpperCase() === 'WELCOME100') disc = 100;
    else if (code.toUpperCase() === 'HEALTH20') disc = Math.round(consultationFee * 0.2);
    else if (code.toUpperCase() === 'FIRSTCARE') disc = 150;

    setAppliedCoupon({ code, discount: disc });
  };

  const handleRemoveItem = (id: string) => {
    removeCartItem(id);
    setAppointmentItems(prev => prev.filter(item => item.id !== id));
  };

  const handleOpenSelectPatient = (itemId: string) => {
    setActiveAssigningCartItemId(itemId);
    setShowWhoIsForModal(true);
  };

  const handleSelectMember = (member: FamilyMemberItem) => {
    if (!activeAssigningCartItemId) return;

    if (activeAssigningCartItemId.startsWith('addon-')) {
      setAddOnPatients(prev => ({
        ...prev,
        [activeAssigningCartItemId]: member
      }));
    } else {
      setAppointmentItems(prev =>
        prev.map(item => {
          if (item.id === activeAssigningCartItemId) {
            const isPink = member.gender.toLowerCase() === 'female' && member.relation.toLowerCase() !== 'self';
            return {
              ...item,
              badgeStyle: isPink ? 'pink' : 'teal',
              patient: {
                id: member.id,
                name: member.name,
                relation: member.relation,
                age: member.age,
                gender: member.gender,
                avatar: member.avatar,
              }
            };
          }
          return item;
        })
      );

      updateCartItemPatient(activeAssigningCartItemId, {
        assignedPatientId: member.id,
        assignedPatientName: member.name,
        assignedPatientRelation: member.relation,
        assignedPatientAge: String(member.age),
        assignedPatientGender: member.gender,
        assignedPatientAvatar: member.avatar,
      });
    }

    setShowWhoIsForModal(false);
    setActiveAssigningCartItemId(null);
  };

  const handleCreateNewMember = (payload: NewFamilyMemberPayload) => {
    const newAvatar = `https://i.pravatar.cc/150?u=${encodeURIComponent(payload.name)}`;
    
    // Add to central profile store
    addProfileFamilyMember({
      name: payload.name,
      relation: payload.relation,
      dob: payload.dob,
      age: payload.age,
      gender: payload.gender,
      phone: payload.phone,
      avatar: newAvatar,
    });

    const newMemberItem: FamilyMemberItem = {
      id: `f-${Date.now()}`,
      name: payload.name,
      relation: payload.relation,
      age: payload.age,
      gender: payload.gender,
      avatar: newAvatar,
    };

    if (activeAssigningCartItemId) {
      handleSelectMember(newMemberItem);
    }

    setLastAddedMember({ name: payload.name, gender: payload.gender });
    setShowAddMemberModal(false);
    setShowSuccessModal(true);
  };

  const handlePaymentSuccess = (payment: PaymentDetails) => {
    setShowPaymentModal(false);
    
    let firstAppointmentId = '';

    // 1. Book all appointments
    appointmentItems.forEach((item, index) => {
      const isMock = item.id.startsWith('mock');
      const docId = isMock ? defaultDoc.id : item.id;
      
      const appId = bookAppointment({
        doctorId: docId,
        doctorName: item.title,
        speciality: item.subtitle,
        hospitalName: defaultDoc.location || 'Apollo Hospital',
        location: defaultDoc.location || 'Bangalore Main Branch',
        date: selectedDate,
        time: selectedTime,
        fee: item.price.toString(),
        type: (type as string) || 'In-Clinic',
        image: item.image,
        paymentId: payment.paymentId,
        paymentMethod: payment.method || 'UPI (Instant)',
        paymentStatus: 'paid',
        totalPaid: item.price,
        assignedPatientId: item.patient.id,
        assignedPatientName: item.patient.name,
        assignedPatientRelation: item.patient.relation,
        assignedPatientGender: item.patient.gender,
        assignedPatientAge: String(item.patient.age),
        assignedPatientAvatar: item.patient.avatar,
      });

      if (index === 0) {
        firstAppointmentId = appId;
      }
    });

    // 2. Book all selected packages
    selectedAddOns.forEach((pkg) => {
      const patient = addOnPatients[pkg.id] || selfMember;
      bookPackage({
        packageId: pkg.id,
        packageTitle: pkg.title,
        hospitalName: pkg.hospitalName,
        patientName: patient.name,
        patientPhone: userProfile.phone || '+91 98765 43210',
        scheduledDate: selectedDate,
        scheduledTime: '08:00 AM (Fasting)',
        paymentMode: 'full',
        totalAmount: parseInt(pkg.price.replace(/[^0-9]/g, '')) || 0,
        amountPaid: parseInt(pkg.price.replace(/[^0-9]/g, '')) || 0,
        paymentStatus: 'paid',
      });
    });

    // 3. Clear the checkout cart
    clearCart();

    // 4. Navigate to success screen
    router.replace({
      pathname: '/booking/success',
      params: {
        appointmentId: firstAppointmentId || `app-${Date.now()}`,
        paymentId: payment.paymentId
      }
    });
  };

  const getCurrentlySelectedMemberId = (): string => {
    if (!activeAssigningCartItemId) return selfMember.id;
    if (activeAssigningCartItemId.startsWith('addon-')) {
      return addOnPatients[activeAssigningCartItemId]?.id || selfMember.id;
    }
    const currentItem = appointmentItems.find(i => i.id === activeAssigningCartItemId);
    return currentItem?.patient.id || selfMember.id;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={colors.text} size={22} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {cartItems.length > 0 && cartItems.every(i => i.type === 'package')
            ? 'Confirm Package Booking'
            : cartItems.some(i => i.type === 'package') && cartItems.some(i => i.type === 'visit')
            ? 'Confirm Order & Booking'
            : 'Confirm Appointment'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        {...scrollProps}
      >
        {/* Appointments / Packages Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {cartItems.length > 0 && cartItems.every(i => i.type === 'package')
              ? `SELECTED PACKAGES (${appointmentItems.length})`
              : cartItems.some(i => i.type === 'package') && cartItems.some(i => i.type === 'visit')
              ? `BOOKING ITEMS (${appointmentItems.length})`
              : `APPOINTMENTS (${appointmentItems.length})`}
          </Text>
          <TouchableOpacity style={styles.editBtn}>
            <Edit size={14} color="#0D9488" style={{ marginRight: 4 }} />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Appointment Cards */}
        {appointmentItems.map((item) => (
          <AppointmentItemCard
            key={item.id}
            item={item}
            onRemoveItem={handleRemoveItem}
            onSelectPatient={handleOpenSelectPatient}
          />
        ))}

        {/* Added Packages Section */}
        {selectedAddOns.length > 0 && (
          <>
            <View style={[styles.sectionHeaderRow, { marginTop: 10 }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                ADDED PACKAGES ({selectedAddOns.length})
              </Text>
            </View>
            {selectedAddOns.map((pkg) => {
              const patient = addOnPatients[pkg.id] || selfMember;
              const isPink = patient.gender.toLowerCase() === 'female' && patient.relation.toLowerCase() !== 'self';
              
              const item: AppointmentItem = {
                id: pkg.id,
                title: pkg.title,
                subtitle: `${pkg.hospitalName} • Lab Add-on`,
                price: parseInt(pkg.price.replace(/[^0-9]/g, '')) || 0,
                image: pkg.image,
                dateStr: selectedDate,
                timeStr: '08:00 AM (Fasting)',
                badgeStyle: isPink ? 'pink' : 'teal',
                patient: patient,
              };

              return (
                <AppointmentItemCard
                  key={pkg.id}
                  item={item}
                  onRemoveItem={() => toggleAddOn(pkg)}
                  onSelectPatient={handleOpenSelectPatient}
                />
              );
            })}
          </>
        )}

        {/* Add Health Packages & Care Plans Carousel */}
        <View style={styles.packagesHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 2 }]}>
            ADD HEALTH PACKAGES & CARE PLANS
          </Text>
          <Text style={styles.packagesSubheader}>Save up to 60% on add-on lab screenings</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.packagesHorizontalRow}
        >
          {addOnPackages.map((pkg) => (
            <AddOnPackageCard
              key={pkg.id}
              item={pkg}
              isAdded={selectedAddOns.some(p => p.id === pkg.id)}
              onToggle={toggleAddOn}
            />
          ))}
        </ScrollView>

        {/* Coupon Section */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>Apply Coupon</Text>
        <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <TouchableOpacity
            style={styles.couponRow}
            onPress={() => setShowCouponOverlay(true)}
            activeOpacity={0.7}
          >
            <View style={styles.couponLeft}>
              <View style={[styles.couponIconBox, appliedCoupon ? { backgroundColor: '#ECFDF5' } : {}]}>
                <Tag size={20} color={appliedCoupon ? '#10B981' : '#EC4899'} />
              </View>
              <View>
                {appliedCoupon ? (
                  <>
                    <Text style={[styles.couponTitleText, { color: colors.text }]}>'{appliedCoupon.code}' Applied</Text>
                    <Text style={styles.couponSavedText}>You saved ₹{appliedCoupon.discount} on consultation</Text>
                  </>
                ) : (
                  <>
                    <Text style={[styles.couponTitleText, { color: colors.text }]}>Have a Coupon Code?</Text>
                    <Text style={styles.couponSubtitleText}>Tap to view available coupons or enter code</Text>
                  </>
                )}
              </View>
            </View>

            {appliedCoupon ? (
              <TouchableOpacity onPress={() => setAppliedCoupon(null)}>
                <Text style={styles.removeCouponBtn}>Remove</Text>
              </TouchableOpacity>
            ) : (
              <ChevronRight size={20} color="#9CA3AF" />
            )}
          </TouchableOpacity>
        </View>

        {/* Payment Summary */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>Payment Summary</Text>
        <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Consultation Fee</Text>
            <Text style={[styles.paymentValue, { color: colors.text }]}>₹{consultationFee}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Platform Fee</Text>
            <Text style={[styles.paymentValue, { color: colors.text }]}>₹{platformFee}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Taxes</Text>
            <Text style={[styles.paymentValue, { color: colors.text }]}>₹{taxes}</Text>
          </View>

          {selectedAddOns.length > 0 && (
            <View style={styles.paymentRow}>
              <Text style={[styles.paymentLabel, { color: '#3B82F6', fontWeight: '600' }]}>
                Add-on Packages ({selectedAddOns.length})
              </Text>
              <Text style={[styles.paymentValue, { color: '#3B82F6', fontWeight: '700' }]}>
                + ₹{addOnsTotal}
              </Text>
            </View>
          )}

          {appliedCoupon && (
            <View style={styles.paymentRow}>
              <Text style={[styles.paymentLabel, { color: '#10B981', fontWeight: '700' }]}>
                Coupon Discount ({appliedCoupon.code})
              </Text>
              <Text style={[styles.paymentValue, { color: '#10B981', fontWeight: '800' }]}>
                - ₹{appliedCoupon.discount}
              </Text>
            </View>
          )}

          <View style={styles.divider} />
          <View style={styles.paymentRow}>
            <Text style={[styles.paymentTotalLabel, { color: colors.text }]}>Total Payable</Text>
            <Text style={[styles.paymentTotalValue, { color: colors.text }]}>₹{totalPayable}</Text>
          </View>
          <View style={styles.secureRow}>
            <ShieldCheck size={14} color="#10B981" />
            <Text style={styles.secureText}>100% Secure Payment</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Action Bar */}
      <StickyBookingPaymentBar
        priceDropText={appliedCoupon ? `Unlocked ₹${appliedCoupon.discount} Coupon OFF` : "Price dropped by ₹167"}
        price={totalPayable}
        originalPrice={totalPayable + 500}
        discountText="55% Off"
        ctaText="Proceed to Pay"
        ctaIcon="shield"
        onPressCTA={() => setShowPaymentModal(true)}
        visible={isFooterVisible}
      />

      {/* Who is this appointment for? Modal */}
      <WhoIsAppointmentForModal
        visible={showWhoIsForModal}
        selectedMemberId={getCurrentlySelectedMemberId()}
        members={allFamilyMembers}
        onClose={() => setShowWhoIsForModal(false)}
        onSelectMember={handleSelectMember}
        onOpenAddMember={() => {
          setShowWhoIsForModal(false);
          setShowAddMemberModal(true);
        }}
      />

      {/* Add Family Member Modal */}
      <AddFamilyMemberModal
        visible={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        onSubmit={handleCreateNewMember}
      />

      {/* Member Added Success Modal */}
      <MemberAddedSuccessModal
        visible={showSuccessModal}
        memberName={lastAddedMember?.name || 'Member'}
        gender={lastAddedMember?.gender}
        onDone={() => setShowSuccessModal(false)}
      />

      {/* Coupon Overlay */}
      <CouponOverlay
        visible={showCouponOverlay}
        onClose={() => setShowCouponOverlay(false)}
        onApply={handleApplyCoupon}
      />

      {/* Payment Gateway Modal */}
      <PaymentGatewayModal
        visible={showPaymentModal}
        amount={totalPayable}
        title="Confirm Appointment Payment"
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 140,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0D9488',
  },
  packagesHeaderRow: {
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  packagesSubheader: {
    fontSize: 11.5,
    color: '#6B7280',
    marginTop: 1,
  },
  packagesHorizontalRow: {
    paddingRight: 16,
  },
  card: {
    borderRadius: 14,
    padding: 12,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  couponLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  couponIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDF2F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  couponTitleText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  couponSubtitleText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1,
  },
  couponSavedText: {
    fontSize: 11.5,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 1,
  },
  removeCouponBtn: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#EF4444',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  paymentValue: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
  },
  paymentTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
  paymentTotalValue: {
    fontSize: 17,
    fontWeight: '800',
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 4,
  },
  secureText: {
    fontSize: 11.5,
    color: '#10B981',
    fontWeight: '600',
  },
});
