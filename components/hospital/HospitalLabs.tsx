import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ShieldCheck, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface HospitalLabsProps {
  hospitalName?: string;
  colors: any;
  isDark: boolean;
  searchQuery?: string;
}

const LAB_TEST_CATEGORIES = [
  { id: 'all', title: 'All Tests' },
  { id: 'blood', title: 'Blood Profiles' },
  { id: 'diabetes', title: 'Sugar & Metabolism' },
  { id: 'organ', title: 'Thyroid & Kidney' },
  { id: 'radiology', title: 'Scans & X-Rays' },
];

const HOSPITAL_LAB_TESTS = [
  {
    id: 'lab-cbc-vital',
    title: 'Complete Blood Count (CBC) & ESR',
    category: 'blood',
    testsCount: 24,
    price: '₹299',
    originalPrice: '₹650',
    discount: '54% OFF',
    sampleType: 'Blood Sample',
    tat: 'Reports in 6 Hours',
    accredited: 'NABL & ISO Certified',
    inclusions: ['Hemoglobin', 'RBC & WBC Count', 'Platelet Count', 'ESR Inflammatory Marker'],
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=400',
  },
  {
    id: 'lab-hba1c-glucose',
    title: 'HbA1c & Fasting Sugar Profile',
    category: 'diabetes',
    testsCount: 8,
    price: '₹349',
    originalPrice: '₹750',
    discount: '53% OFF',
    sampleType: 'Fasting Blood Sample',
    tat: 'Same Day Reports',
    accredited: 'NABL Accredited',
    inclusions: ['HbA1c 3-Month Average', 'Fasting Plasma Glucose', 'Average Blood Glucose'],
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=400',
  },
  {
    id: 'lab-thyroid-total',
    title: 'Thyroid Care Profile (T3, T4, TSH)',
    category: 'organ',
    testsCount: 3,
    price: '₹399',
    originalPrice: '₹890',
    discount: '55% OFF',
    sampleType: 'Blood Sample',
    tat: 'Reports in 12 Hours',
    accredited: 'NABL Certified',
    inclusions: ['Total Triiodothyronine (T3)', 'Total Thyroxine (T4)', 'Thyroid Stimulating Hormone (TSH)'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=400',
  },
  {
    id: 'lab-lipid-cardiac',
    title: 'Lipid Profile & Cholesterol Screening',
    category: 'blood',
    testsCount: 9,
    price: '₹449',
    originalPrice: '₹950',
    discount: '52% OFF',
    sampleType: 'Fasting Blood Sample',
    tat: 'Reports in 8 Hours',
    accredited: 'NABL Certified',
    inclusions: ['Total Cholesterol', 'HDL Good Cholesterol', 'LDL Bad Cholesterol', 'Triglycerides'],
    image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=400',
  },
  {
    id: 'lab-usg-abdomen',
    title: 'Ultrasound Abdomen & Pelvis (USG)',
    category: 'radiology',
    testsCount: 1,
    price: '₹1,299',
    originalPrice: '₹2,200',
    discount: '41% OFF',
    sampleType: 'Radiology Scan',
    tat: 'Instant Report',
    accredited: 'Hospital Imaging Wing',
    inclusions: ['Full Abdominal Ultrasound', 'Radiologist Consultation', 'High-Res Digital Prints'],
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=400',
  },
];

export default function HospitalLabs({ hospitalName = 'Hospital Diagnostic Wing', colors, isDark, searchQuery = '' }: HospitalLabsProps) {
  const router = useRouter();
  const [selectedCat, setSelectedCat] = useState('all');

  const filteredTests = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    return HOSPITAL_LAB_TESTS.filter(t => {
      const matchCat = selectedCat === 'all' || t.category === selectedCat;
      const matchQ = !q || t.title.toLowerCase().includes(q) || t.inclusions.some(i => i.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }, [selectedCat, searchQuery]);

  return (
    <View style={styles.container}>
      {/* Category Pills Header */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
        {LAB_TEST_CATEGORIES.map((cat) => {
          const isActive = selectedCat === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.catPill,
                {
                  backgroundColor: isActive ? (isDark ? '#2D213F' : '#F3E8FF') : (isDark ? '#1C1929' : '#FFFFFF'),
                  borderColor: isActive ? '#6527BE' : (isDark ? '#333' : '#E2E8F0'),
                },
              ]}
              onPress={() => setSelectedCat(cat.id)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.catText,
                  { color: isActive ? '#6527BE' : (isDark ? '#CBD5E1' : '#475569'), fontWeight: isActive ? '700' : '600' },
                ]}
              >
                {cat.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Hospital Accredited Assurance Banner */}
      <View style={[styles.assuranceBanner, { backgroundColor: isDark ? '#112D23' : '#E6F6F2' }]}>
        <ShieldCheck size={18} color="#00A981" />
        <View style={{ flex: 1 }}>
          <Text style={styles.assuranceTitle}>NABL Accredited Hospital Laboratory</Text>
          <Text style={styles.assuranceSub}>Free home sample collection & verified digital reports</Text>
        </View>
      </View>

      {/* Lab Tests List */}
      <View style={styles.testsList}>
        {filteredTests.map((test) => (
          <View
            key={test.id}
            style={[
              styles.testCard,
              { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', borderColor: isDark ? '#2C2C2E' : '#EAEAEA' },
            ]}
          >
            <Text style={[styles.testTitle, { color: colors.text }]}>{test.title}</Text>

            {/* Price & Booking Action Footer */}
            <View style={styles.testCardFooter}>
              <View style={styles.priceCol}>
                <Text style={[styles.testPrice, { color: colors.text }]}>{test.price}</Text>

                <View style={styles.subPriceRow}>
                  {test.originalPrice ? (
                    <Text style={styles.testOriginalPrice}>{test.originalPrice}</Text>
                  ) : null}

                  {test.discount ? (
                    <View style={[styles.discountPill, { backgroundColor: isDark ? '#3B1E1E' : '#FEF2F2' }]}>
                      <Text style={styles.discountText}>{test.discount}</Text>
                    </View>
                  ) : null}

                  <Text style={styles.sampleSubtext}>• {test.sampleType}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.redOutlineBtn, { backgroundColor: isDark ? '#1E1E24' : '#FFFFFF' }]}
                activeOpacity={0.8}
                onPress={() => router.push({ pathname: '/packages/checkout/[packageId]', params: { packageId: test.id } })}
              >
                <Text style={styles.redOutlineBtnText}>Book Test</Text>
                <ChevronRight size={14} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  catScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 10,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
  },
  catText: {
    fontSize: 12.5,
  },
  assuranceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
  },
  assuranceTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#00A981',
  },
  assuranceSub: {
    fontSize: 11,
    color: '#475569',
    marginTop: 1,
  },
  testsList: {
    gap: 12,
  },
  testCard: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  testTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  testCardFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  priceCol: {
    justifyContent: 'center',
  },
  testPrice: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  testOriginalPrice: {
    fontSize: 13,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  discountPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '800',
  },
  sampleSubtext: {
    fontSize: 11.5,
    color: '#64748B',
  },
  redOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  redOutlineBtnText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },
});
