import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronUp, ChevronDown, X, CheckCircle2, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import { useBookingStore } from '@/hooks/useBookingStore';

import CategoryHeader from '@/components/category/CategoryHeader';
import CategoryTabs from '@/components/category/CategoryTabs';
import HospitalFilterBar from '@/components/hospital/HospitalFilterBar';
import FrequentlyBookedSection, { FrequentlyBookedItem } from '@/components/hospital/FrequentlyBookedSection';
import RecommendedDoctorCard, { DoctorData } from '@/components/hospital/RecommendedDoctorCard';
import PackageItemCard, { PackageItemCardData } from '@/components/packages/cards/PackageItemCard';
import AddVisitModal from '@/components/booking/AddVisitModal';
import AddPackageModal from '@/components/booking/AddPackageModal';

import PlannedSurgeryCare from '@/components/care/PlannedSurgeryCare';
import InternationalPatientCare from '@/components/care/InternationalPatientCare';
import WomensHealthCare from '@/components/care/WomensHealthCare';
import MensHealthCare from '@/components/care/MensHealthCare';
import PreventiveHealthCare from '@/components/care/PreventiveHealthCare';
import SecondOpinionCare from '@/components/care/SecondOpinionCare';

const TABS = ['Doctors', 'Packages'];

export interface CategoryPackageData extends PackageItemCardData {
  subCategory: string;
}

interface CategoryConfig {
  title: string;
  subtitle: string;
  specialtyName: string;
  emoji: string;
  icon: string;
  frequentlyBooked: FrequentlyBookedItem[];
  defaultDoctors: DoctorData[];
  packageFilterCategories: { id: string; name: string }[];
  packages: CategoryPackageData[];
}

const CATEGORY_CONFIG_MAP: Record<string, CategoryConfig> = {
  knee: {
    title: 'Knee Care & Pain Relief',
    subtitle: 'Find top orthopedic doctors, knee surgeries & joint rehab packages',
    specialtyName: 'Knee & Orthopedics',
    emoji: '🦴',
    icon: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=200',
    frequentlyBooked: [
      {
        id: 'fb-k1',
        title: 'Knee Pain Consultation',
        price: '₹800',
        image: 'https://cdn-icons-png.flaticon.com/512/2864/2864350.png',
        type: 'consultation',
        description: 'Specialist orthopedic consultation to diagnose joint pain, ligament tears, or cartilage stiffness.',
      },
      {
        id: 'fb-k2',
        title: 'Knee X-Ray + Consultation',
        price: '₹1,200',
        image: 'https://cdn-icons-png.flaticon.com/512/3004/3004458.png',
        type: 'consultation',
        description: 'Digital bilateral standing knee X-Ray paired with a doctor review and treatment plan.',
      },
      {
        id: 'fb-k3',
        title: 'Joint Mobility & Physio',
        price: '₹1,500',
        image: 'https://cdn-icons-png.flaticon.com/512/865/865969.png',
        type: 'package',
        description: 'Comprehensive physical rehabilitation session and mobility strengthening assessment.',
      },
    ],
    defaultDoctors: [
      {
        id: 'doc-knee-1',
        name: 'Dr. Arjun Reddy',
        speciality: 'Joint Replacement & Arthroscopy',
        emoji: '🦴',
        fee: '800',
        hospitalName: 'Manipal Hospital, Whitefield',
        location: 'Whitefield, Bengaluru',
        languages: 'English • Hindi • Kannada',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400',
        availableSlots: ['10:00 AM', '01:00 PM', '05:30 PM'],
        nextAvailableTime: '10:00 AM',
      },
      {
        id: 'doc-knee-2',
        name: 'Dr. Priya Nambiar',
        speciality: 'Orthopedic Surgeon',
        emoji: '🦴',
        fee: '900',
        hospitalName: 'Apollo Hospitals, Bannerghatta',
        location: 'Bannerghatta Rd, Bengaluru',
        languages: 'English • Hindi • Tamil',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400',
        availableSlots: ['09:30 AM', '02:30 PM', '06:00 PM'],
        nextAvailableTime: '09:30 AM',
      },
      {
        id: 'doc-knee-3',
        name: 'Dr. Rajesh Khanna',
        speciality: 'Sports Injury & Knee Specialist',
        emoji: '🦴',
        fee: '750',
        hospitalName: 'Fortis Hospital, Cunningham Rd',
        location: 'Cunningham Rd, Bengaluru',
        languages: 'English • Hindi • Telugu',
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400',
        availableSlots: ['11:00 AM', '03:00 PM', '07:00 PM'],
        nextAvailableTime: '11:00 AM',
      },
    ],
    packageFilterCategories: [
      { id: 'all', name: 'All Knee Packages' },
      { id: 'surgery', name: 'Robotic Surgery' },
      { id: 'rehab', name: 'Rehab & Physio' },
      { id: 'injections', name: 'PRP Injections' },
      { id: 'scans', name: 'Scans & Diagnostics' },
    ],
    packages: [
      {
        id: 'pkg-knee-1',
        title: '3D Robot-Assisted Knee Surgery',
        subtitle: 'Robotic knee replacement, implant & 10 physio sessions',
        subCategory: 'surgery',
        price: '₹1,85,000',
        originalPrice: '₹2,20,000',
        discount: '16% OFF',
        image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=600',
        inclusions: ['Robotic Surgery', 'US FDA Implant', '4 Days Room Stay', '10 Physio Sessions'],
      },
      {
        id: 'pkg-knee-2',
        title: 'Complete Knee Rehab & Joint Physio',
        subtitle: 'Joint mobility therapy, ultrasound physiotherapy & consultation',
        subCategory: 'rehab',
        price: '₹18,999',
        originalPrice: '₹25,999',
        discount: '27% OFF',
        image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=600',
        inclusions: ['Orthopedic Review', '12 Physio Sessions', 'Knee Bracing', 'Followup Review'],
      },
      {
        id: 'pkg-knee-3',
        title: 'Advanced Cartilage & PRP Joint Therapy',
        subtitle: 'Autologous platelet-rich plasma injection for joint stiffness',
        subCategory: 'injections',
        price: '₹12,500',
        originalPrice: '₹16,000',
        discount: '22% OFF',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600',
        inclusions: ['Ultrasound Guided PRP', 'Orthopedic Review', 'Local Anesthetic', 'Followup Check'],
      },
      {
        id: 'pkg-knee-4',
        title: 'Knee Pain Diagnostic & 3T MRI Package',
        subtitle: 'High-field bilateral MRI, digital X-Ray & surgeon consultation',
        subCategory: 'scans',
        price: '₹7,500',
        originalPrice: '₹10,000',
        discount: '25% OFF',
        image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=600',
        inclusions: ['High-Field 3T MRI', 'Standing X-Ray', 'Senior Orthopedic Consult', 'Care Roadmap'],
      },
    ],
  },
  ortho: {
    title: 'Orthopedics & Joint Care',
    subtitle: 'Expert bone, joint & spine care specialists & treatment plans',
    specialtyName: 'Orthopedics & Spine',
    emoji: '🦴',
    icon: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=200',
    frequentlyBooked: [
      {
        id: 'fb-o1',
        title: 'Orthopedic Consultation',
        price: '₹800',
        image: 'https://cdn-icons-png.flaticon.com/512/2864/2864350.png',
        type: 'consultation',
        description: 'Comprehensive bone and joint checkup with our leading orthopedic faculty.',
      },
      {
        id: 'fb-o2',
        title: 'Spine & Posture Check',
        price: '₹1,300',
        image: 'https://cdn-icons-png.flaticon.com/512/3004/3004458.png',
        type: 'consultation',
        description: 'Full spinal alignment evaluation and ergonomic review for disc & lower back relief.',
      },
      {
        id: 'fb-o3',
        title: 'DEXA Bone Density Scan',
        price: '₹1,600',
        image: 'https://cdn-icons-png.flaticon.com/512/865/865969.png',
        type: 'package',
        description: 'Bone mineral density test for osteoporosis with doctor consultation.',
      },
    ],
    defaultDoctors: [
      {
        id: 'doc-ortho-1',
        name: 'Dr. Rajiv Menon',
        speciality: 'Spine & Orthopedic Surgeon',
        emoji: '🦴',
        fee: '900',
        hospitalName: 'Aster CMI Hospital, Hebbal',
        location: 'Hebbal, Bengaluru',
        languages: 'English • Hindi • Malayalam',
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400',
        availableSlots: ['10:00 AM', '02:00 PM', '06:00 PM'],
        nextAvailableTime: '10:00 AM',
      },
      {
        id: 'doc-ortho-2',
        name: 'Dr. Priyamvada Rao',
        speciality: 'Rheumatology & Joint Care',
        emoji: '🦴',
        fee: '850',
        hospitalName: 'Manipal Hospital, HAL Airport Rd',
        location: 'Old Airport Rd, Bengaluru',
        languages: 'English • Hindi • Kannada',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400',
        availableSlots: ['11:30 AM', '03:30 PM', '07:30 PM'],
        nextAvailableTime: '11:30 AM',
      },
    ],
    packageFilterCategories: [
      { id: 'all', name: 'All Ortho Packages' },
      { id: 'spine', name: 'Spine & Disc' },
      { id: 'joint', name: 'Joint Replacement' },
      { id: 'bone', name: 'Bone Health & DEXA' },
    ],
    packages: [
      {
        id: 'pkg-ortho-1',
        title: 'Total Spine & Disc Rehabilitation Plan',
        subtitle: 'Spine decompression therapy, posture alignment & specialist review',
        subCategory: 'spine',
        price: '₹24,999',
        originalPrice: '₹32,000',
        discount: '22% OFF',
        image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=600',
        inclusions: ['Spine MRI Review', '15 Rehab Sessions', 'Orthopedic Review', 'Ergonomic Support'],
      },
      {
        id: 'pkg-ortho-2',
        title: 'Minimally Invasive Hip & Joint Care',
        subtitle: 'Keyhole hip arthroscopy, joint reconstruction & post-op care',
        subCategory: 'joint',
        price: '₹1,95,000',
        originalPrice: '₹2,40,000',
        discount: '18% OFF',
        image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=600',
        inclusions: ['Ceramic Implant', 'Daycare / Room Stay', 'Post-Op Physio', 'Lifetime Tracking'],
      },
      {
        id: 'pkg-ortho-3',
        title: 'Advanced DEXA Bone Density & Calcium Panel',
        subtitle: 'Full body DEXA screening with Vitamin D3 and calcium profile',
        subCategory: 'bone',
        price: '₹3,200',
        originalPrice: '₹4,800',
        discount: '33% OFF',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600',
        inclusions: ['DEXA Full Body Scan', 'Serum Calcium', 'Vitamin D3 Profile', 'Consultation'],
      },
    ],
  },
  cardiac: {
    title: 'Cardiology & Heart Care',
    subtitle: 'Comprehensive cardiac checkups, echo scans & surgery packages',
    specialtyName: 'Cardiology',
    emoji: '🫀',
    icon: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=200',
    frequentlyBooked: [
      {
        id: 'fb-c1',
        title: 'Cardiology Consultation',
        price: '₹800',
        image: 'https://cdn-icons-png.flaticon.com/512/2864/2864350.png',
        type: 'consultation',
        description: 'Direct consultation with senior cardiologists for chest tightness, palpitations, and hypertension.',
      },
      {
        id: 'fb-c2',
        title: 'ECG + Consultation',
        price: '₹1,200',
        image: 'https://cdn-icons-png.flaticon.com/512/3004/3004458.png',
        type: 'consultation',
        description: '12-lead ECG analysis followed by specialist interpretation and personalized cardiac advice.',
      },
      {
        id: 'fb-c3',
        title: 'Heart Health Check',
        price: '₹1,500',
        image: 'https://cdn-icons-png.flaticon.com/512/865/865969.png',
        type: 'package',
        description: 'Preventive cardiac panel including ECG, Lipid Profile, Blood Sugar, and Cardiologist review.',
      },
    ],
    defaultDoctors: [
      {
        id: 'doc-rv',
        name: 'Dr. Ramesh Verma',
        speciality: 'Cardiologist',
        emoji: '🫀',
        fee: '800',
        hospitalName: 'Apollo Hospitals, Bannerghatta',
        location: 'Bannerghatta, Bengaluru',
        languages: 'English • Hindi • Telugu',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400',
        availableSlots: ['10:00 AM', '12:30 PM', '05:00 PM'],
        nextAvailableTime: '10:00 AM',
      },
      {
        id: 'doc-as',
        name: 'Dr. Ananya Sharma',
        speciality: 'Interventional Cardiologist',
        emoji: '🫀',
        fee: '900',
        hospitalName: 'Narayana Health City',
        location: 'Bommasandra, Bengaluru',
        languages: 'English • Hindi',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400',
        availableSlots: ['09:30 AM', '01:00 PM', '06:30 PM'],
        nextAvailableTime: '09:30 AM',
      },
      {
        id: 'doc-sr',
        name: 'Dr. Sandeep Reddy',
        speciality: 'Cardiac Electrophysiologist',
        emoji: '🫀',
        fee: '700',
        hospitalName: 'Manipal Hospital, HAL Airport Rd',
        location: 'Old Airport Rd, Bengaluru',
        languages: 'English • Hindi • Telugu',
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400',
        availableSlots: ['10:30 AM', '02:00 PM', '07:00 PM'],
        nextAvailableTime: '10:30 AM',
      },
    ],
    packageFilterCategories: [
      { id: 'all', name: 'All Cardiac Packages' },
      { id: 'echo', name: 'Echo & Scans' },
      { id: 'cath', name: 'Cath & Angiography' },
      { id: 'screening', name: 'Preventive Screening' },
      { id: 'rehab', name: 'Cardiac Rehab' },
    ],
    packages: [
      {
        id: 'pkg-cardiac-1',
        title: 'Comprehensive Heart Checkup & Echo',
        subtitle: 'ECG, TMT, 2D Echo, Lipid profile & Cardiac consult',
        subCategory: 'echo',
        price: '₹4,999',
        originalPrice: '₹8,500',
        discount: '41% OFF',
        image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=600',
        inclusions: ['2D Echo Test', 'TMT Stress Test', 'Cardiologist Consult', 'Lipid Panel'],
      },
      {
        id: 'pkg-cardiac-2',
        title: 'Advanced Cardiac Cath & Angiography Plan',
        subtitle: 'Digital Coronary Angiography, Daycare stay & consult',
        subCategory: 'cath',
        price: '₹28,500',
        originalPrice: '₹35,000',
        discount: '18% OFF',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600',
        inclusions: ['Coronary Angiogram', 'Daycare Bed', 'Cardiologist Review', 'Medicines'],
      },
      {
        id: 'pkg-cardiac-3',
        title: 'Executive Preventive Cardiac Screen',
        subtitle: 'Complete 12-lead ECG, Lipid Profile & blood sugar test',
        subCategory: 'screening',
        price: '₹2,999',
        originalPrice: '₹4,500',
        discount: '33% OFF',
        image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=600',
        inclusions: ['12-Lead ECG', 'Lipid Profile', 'Blood Sugar Test', 'Cardiology Consult'],
      },
      {
        id: 'pkg-cardiac-4',
        title: 'Post-Procedure Monitored Cardiac Rehab',
        subtitle: '8 supervised cardio sessions, continuous telemetry & diet review',
        subCategory: 'rehab',
        price: '₹14,999',
        originalPrice: '₹20,000',
        discount: '25% OFF',
        image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600',
        inclusions: ['8 Monitored Sessions', 'Dietitian Plan', 'ECG Monitoring', 'Doctor Review'],
      },
    ],
  },
  skin: {
    title: 'Dermatology & Skin Care',
    subtitle: 'Clinical acne treatments, laser & skincare care plans',
    specialtyName: 'Dermatology & Skin',
    emoji: '✨',
    icon: 'https://images.unsplash.com/photo-1512290900676-26c2a4d4b5b3?q=80&w=200',
    frequentlyBooked: [
      {
        id: 'fb-s1',
        title: 'Dermatology Consult',
        price: '₹800',
        image: 'https://cdn-icons-png.flaticon.com/512/2864/2864350.png',
        type: 'consultation',
        description: 'Clinical evaluation for acne, eczema, pigmentation, hair fall, and general skin wellness.',
      },
      {
        id: 'fb-s2',
        title: 'Acne & Skin Clarifying',
        price: '₹1,200',
        image: 'https://cdn-icons-png.flaticon.com/512/3004/3004458.png',
        type: 'package',
        description: 'Specialist medi-facial peel targeting active breakouts and deep pores.',
      },
      {
        id: 'fb-s3',
        title: 'Glow & Laser Assessment',
        price: '₹1,600',
        image: 'https://cdn-icons-png.flaticon.com/512/865/865969.png',
        type: 'package',
        description: 'Comprehensive dermatoscopic examination with laser eligibility screening.',
      },
    ],
    defaultDoctors: [
      {
        id: 'doc-skin-1',
        name: 'Dr. Sneha Roy',
        speciality: 'Clinical Dermatologist & Trichologist',
        emoji: '✨',
        fee: '800',
        hospitalName: 'Kaya Skin Clinic, Indiranagar',
        location: 'Indiranagar, Bengaluru',
        languages: 'English • Hindi • Bengali',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400',
        availableSlots: ['10:00 AM', '02:00 PM', '06:00 PM'],
        nextAvailableTime: '10:00 AM',
      },
      {
        id: 'doc-skin-2',
        name: 'Dr. Aisha Khan',
        speciality: 'Cosmetic Dermatologist',
        emoji: '✨',
        fee: '900',
        hospitalName: 'Apollo Clinic, Koramangala',
        location: 'Koramangala, Bengaluru',
        languages: 'English • Hindi • Urdu',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400',
        availableSlots: ['11:00 AM', '03:30 PM', '07:00 PM'],
        nextAvailableTime: '11:00 AM',
      },
    ],
    packageFilterCategories: [
      { id: 'all', name: 'All Skin Packages' },
      { id: 'acne', name: 'Acne & Scars' },
      { id: 'laser', name: 'Laser & HydraGlow' },
      { id: 'hair', name: 'Hair & Scalp' },
      { id: 'antiaging', name: 'Anti-Aging & Lift' },
    ],
    packages: [
      {
        id: 'pkg-skin-1',
        title: 'Clinical Acne & Clarifying Laser Plan',
        subtitle: '6-session clinical chemical peels, laser toning & derma consult',
        subCategory: 'acne',
        price: '₹14,999',
        originalPrice: '₹22,000',
        discount: '32% OFF',
        image: 'https://images.unsplash.com/photo-1512290900676-26c2a4d4b5b3?q=80&w=600',
        inclusions: ['Derma Consult', '6x Laser Toning', 'Skin Barrier Serum', 'Monthly Followups'],
      },
      {
        id: 'pkg-skin-2',
        title: 'Advanced HydraGlow & Skin Rejuvenation',
        subtitle: 'Medical grade hydrafacial, serum infusion & LED light therapy',
        subCategory: 'laser',
        price: '₹8,499',
        originalPrice: '₹12,000',
        discount: '29% OFF',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600',
        inclusions: ['HydraFacial MD', 'Hyaluronic Booster', 'LED Light Therapy', 'Skin Analysis'],
      },
      {
        id: 'pkg-skin-3',
        title: 'GFC Hair Regrowth & Scalp Protocol',
        subtitle: 'Growth factor concentrate therapy for hair thinning & density',
        subCategory: 'hair',
        price: '₹18,500',
        originalPrice: '₹25,000',
        discount: '26% OFF',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=600',
        inclusions: ['4x GFC Therapy', 'Scalp Micro-Check', 'Biotin Infusion', 'Trichologist Review'],
      },
      {
        id: 'pkg-skin-4',
        title: 'Collagen Lift & RF Anti-Aging Therapy',
        subtitle: 'Radio-frequency skin tightening & deep collagen remodeling',
        subCategory: 'antiaging',
        price: '₹21,999',
        originalPrice: '₹28,000',
        discount: '21% OFF',
        image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600',
        inclusions: ['RF Microneedling', 'Peptide Infusion', 'Collagen Mask', 'Derma Followup'],
      },
    ],
  },
  pregnancy: {
    title: 'Pregnancy & Maternity',
    subtitle: 'Maternity packages, delivery suites & 40-week screening plans',
    specialtyName: 'Gynaecology & Maternity',
    emoji: '🤰',
    icon: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=200',
    frequentlyBooked: [
      {
        id: 'fb-p1',
        title: 'Gynecologist Consult',
        price: '₹900',
        image: 'https://cdn-icons-png.flaticon.com/512/2864/2864350.png',
        type: 'consultation',
        description: 'Expert antenatal and prenatal evaluation with senior obstetrician.',
      },
      {
        id: 'fb-p2',
        title: 'Ultrasound Scan + Review',
        price: '₹1,500',
        image: 'https://cdn-icons-png.flaticon.com/512/3004/3004458.png',
        type: 'consultation',
        description: 'Detailed 2D/3D obstetric ultrasound scan with biometric review.',
      },
      {
        id: 'fb-p3',
        title: '40-Week Maternity Check',
        price: '₹1,800',
        image: 'https://cdn-icons-png.flaticon.com/512/865/865969.png',
        type: 'package',
        description: 'Complete trimester blood work, gestational health panel, and delivery consultation.',
      },
    ],
    defaultDoctors: [
      {
        id: 'doc-preg-1',
        name: 'Dr. Meenakshi Sundaram',
        speciality: 'Senior Obstetrician & Gynecologist',
        emoji: '🤰',
        fee: '900',
        hospitalName: 'Cloudnine Hospital, Jayanagar',
        location: 'Jayanagar, Bengaluru',
        languages: 'English • Hindi • Tamil • Kannada',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400',
        availableSlots: ['09:30 AM', '01:30 PM', '05:30 PM'],
        nextAvailableTime: '09:30 AM',
      },
      {
        id: 'doc-preg-2',
        name: 'Dr. Deepa Shenoy',
        speciality: 'High-Risk Pregnancy Consultant',
        emoji: '🤰',
        fee: '950',
        hospitalName: 'Motherhood Hospital, Indiranagar',
        location: 'Indiranagar, Bengaluru',
        languages: 'English • Hindi • Konkani',
        image: 'https://images.unsplash.com/photo-1594824813689-d37222d8fce3?q=80&w=400',
        availableSlots: ['10:30 AM', '03:00 PM', '06:30 PM'],
        nextAvailableTime: '10:30 AM',
      },
    ],
    packageFilterCategories: [
      { id: 'all', name: 'All Maternity Packages' },
      { id: 'delivery', name: 'Delivery Suites' },
      { id: 'scans', name: 'Trimester Scans' },
      { id: 'postnatal', name: 'Postnatal & Baby Care' },
    ],
    packages: [
      {
        id: 'pkg-preg-1',
        title: 'Complete Maternity Care Package',
        subtitle: 'Full pregnancy cover, trimesters 1-3, scans & delivery',
        subCategory: 'delivery',
        price: '₹45,000',
        originalPrice: '₹60,000',
        discount: '25% OFF',
        image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600',
        inclusions: ['Gynaecologist Consults', '2D/3D Scans', 'Labor Room Stay', 'Postnatal Care'],
      },
      {
        id: 'pkg-preg-2',
        title: 'Premium Delivery Suite Package',
        subtitle: 'Private luxury suite delivery & pediatrician cover',
        subCategory: 'delivery',
        price: '₹75,999',
        originalPrice: '₹90,000',
        discount: '15% OFF',
        image: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?q=80&w=600',
        inclusions: ['Luxury Private Suite', 'Pediatrician On-Call', 'Gdm Screening', 'Baby Gift Hamper'],
      },
      {
        id: 'pkg-preg-3',
        title: '40-Week 3-Trimester Fetal Scan Screen',
        subtitle: 'Complete trimester 1-3 ultrasound scans with doctor assessment',
        subCategory: 'scans',
        price: '₹16,500',
        originalPrice: '₹21,000',
        discount: '21% OFF',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600',
        inclusions: ['NT Scan', 'Anomaly Scan', 'Fetal Doppler', 'Obstetrician Review'],
      },
      {
        id: 'pkg-preg-4',
        title: 'Postnatal Recovery & Lactation Support',
        subtitle: 'Specialist lactation guidance, pelvic therapy & pediatric checks',
        subCategory: 'postnatal',
        price: '₹11,999',
        originalPrice: '₹15,000',
        discount: '20% OFF',
        image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=600',
        inclusions: ['Lactation Specialist', 'Pelvic Floor Physio', 'Pediatric Check', 'Nutrition Plan'],
      },
    ],
  },
  labs: {
    title: 'Arogyon Labs & Diagnostic Tests',
    subtitle: 'NABL certified master health checkups, scans & home sample collection',
    specialtyName: 'Diagnostics & Pathology',
    emoji: '🧪',
    icon: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=400',
    frequentlyBooked: [
      {
        id: 'fb-l1',
        title: 'NABL Full Body Check',
        price: '₹799',
        image: 'https://cdn-icons-png.flaticon.com/512/2864/2864350.png',
        type: 'package',
        description: '64 vital parameter test with CBC, Liver, Kidney, Lipid and Glucose profiles.',
      },
      {
        id: 'fb-l2',
        title: 'Thyroid & Vitamin Panel',
        price: '₹999',
        image: 'https://cdn-icons-png.flaticon.com/512/3004/3004458.png',
        type: 'package',
        description: 'Complete T3, T4, TSH, Vitamin D and Vitamin B12 profile with home sample pickup.',
      },
      {
        id: 'fb-l3',
        title: 'Executive Health Screen',
        price: '₹1,999',
        image: 'https://cdn-icons-png.flaticon.com/512/865/865969.png',
        type: 'package',
        description: 'Comprehensive 85+ parameter test with free home collection and doctor summary.',
      },
    ],
    defaultDoctors: [
      {
        id: 'doc-lab-1',
        name: 'Dr. Anand Sen',
        speciality: 'Chief Pathologist & Wellness Expert',
        emoji: '🧪',
        fee: '600',
        hospitalName: 'Arogyon Central Diagnostic Labs',
        location: 'Koramangala, Bengaluru',
        languages: 'English • Hindi',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400',
        availableSlots: ['08:00 AM', '11:00 AM', '04:00 PM'],
        nextAvailableTime: '08:00 AM',
      },
    ],
    packageFilterCategories: [
      { id: 'all', name: 'All Lab Packages' },
      { id: 'fullbody', name: 'Full Body Screen' },
      { id: 'vitamins', name: 'Thyroid & Vitamins' },
      { id: 'executive', name: 'Executive Organ Panel' },
      { id: 'cancer', name: 'Cancer Screen' },
    ],
    packages: [
      {
        id: 'pkg-labs-1',
        title: 'NABL Full Body Master Health Screen',
        subtitle: '85 vital parameters including CBC, LFT, KFT, Lipid, HbA1c & Vitamin D/B12',
        subCategory: 'fullbody',
        price: '₹2,499',
        originalPrice: '₹5,000',
        discount: '50% OFF',
        image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=600',
        inclusions: ['85 Parameters', 'Free Home Collection', 'Digital Reports in 12h', 'Doctor Teleconsult'],
      },
      {
        id: 'pkg-labs-2',
        title: 'Complete Thyroid, Vitamin D3 & B12 Panel',
        subtitle: 'Deficiency check with high-precision chemiluminescence analysis',
        subCategory: 'vitamins',
        price: '₹999',
        originalPrice: '₹1,800',
        discount: '45% OFF',
        image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=600',
        inclusions: ['T3 T4 TSH', 'Vitamin D3', 'Vitamin B12', 'Serum Calcium'],
      },
      {
        id: 'pkg-labs-3',
        title: 'Executive Vital Organ Master Health Check',
        subtitle: '92 parameters covering heart, liver, kidney, pancreas and lungs',
        subCategory: 'executive',
        price: '₹3,499',
        originalPrice: '₹6,000',
        discount: '42% OFF',
        image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600',
        inclusions: ['92 Parameters', 'Liver & Kidney Panel', 'Lipid Profile', 'Physician Summary'],
      },
      {
        id: 'pkg-labs-4',
        title: 'Preventive Early Cancer Marker Screen',
        subtitle: 'Oncomarker blood profiling for early detection and peace of mind',
        subCategory: 'cancer',
        price: '₹5,999',
        originalPrice: '₹8,500',
        discount: '30% OFF',
        image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=600',
        inclusions: ['CEA, CA-125, PSA', 'CBC & ESR', 'USG Screening', 'Onco-Physician Review'],
      },
    ],
  },
};

const ALL_SPECIALTIES = [
  { id: 'All', name: 'All Specialties' },
  { id: 'Cardiology', name: 'Cardiology & Heart' },
  { id: 'Orthopedics', name: 'Orthopedics & Joint' },
  { id: 'Dermatology', name: 'Dermatology & Skin' },
  { id: 'Gynaecology', name: 'Gynaecology & Maternity' },
  { id: 'Neurology', name: 'Neurology' },
  { id: 'Nephrology', name: 'Nephrology & Kidney' },
  { id: 'Diagnostics', name: 'Diagnostics & Labs' },
  { id: 'General Medicine', name: 'General Medicine' },
];

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const addCartItem = useBookingStore((state) => state.addCartItem);

  const rawSlug = (typeof id === 'string' ? id : '').toLowerCase().trim();
  const normalizedId = rawSlug.replace(/[-_]/g, '');

  if (['opinion', 'secondopinion', '2ndopinion', 'second-opinion'].includes(normalizedId)) {
    return <SecondOpinionCare colors={colors} isDark={isDark} />;
  }

  if (['postsurgery', 'plannedsurgery', 'surgery', 'generalsurgery', '5'].includes(normalizedId)) {
    return <PlannedSurgeryCare colors={colors} isDark={isDark} />;
  }

  if (['international', 'internationalcare', 'internationalpatientcare', 'medicaltourism', 'globalcare'].includes(normalizedId)) {
    return <InternationalPatientCare colors={colors} isDark={isDark} />;
  }

  if (['women', 'womens', 'womenshealth', 'gynaecologist', 'gynecology', 'maternity', 'maternitycare', '9'].includes(normalizedId)) {
    return <WomensHealthCare colors={colors} isDark={isDark} />;
  }

  if (['men', 'mens', 'menshealth', 'executivewellness'].includes(normalizedId)) {
    return <MensHealthCare colors={colors} isDark={isDark} />;
  }

  if (['preventive', 'preventivehealth', 'fitness', 'fullbody', 'wellness', 'wellnesscare'].includes(normalizedId)) {
    return <PreventiveHealthCare colors={colors} isDark={isDark} />;
  }

  const categoryId = rawSlug || 'knee';
  const categoryConfig: CategoryConfig = CATEGORY_CONFIG_MAP[categoryId] ?? {
    title: `${categoryId.charAt(0).toUpperCase() + categoryId.slice(1)} Care`,
    subtitle: `Find the best care, specialists and health packages for ${categoryId}`,
    specialtyName: categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
    emoji: '🩺',
    icon: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=200',
    frequentlyBooked: [
      {
        id: `fb-${categoryId}-1`,
        title: `${categoryId.charAt(0).toUpperCase() + categoryId.slice(1)} Consultation`,
        price: '₹800',
        image: 'https://cdn-icons-png.flaticon.com/512/2864/2864350.png',
        type: 'consultation',
        description: `Comprehensive consultation with leading specialist for ${categoryId}.`,
      },
      {
        id: `fb-${categoryId}-2`,
        title: `${categoryId.charAt(0).toUpperCase() + categoryId.slice(1)} Diagnostic Evaluation`,
        price: '₹1,200',
        image: 'https://cdn-icons-png.flaticon.com/512/3004/3004458.png',
        type: 'consultation',
        description: `Complete diagnostic evaluation and doctor summary for ${categoryId}.`,
      },
      {
        id: `fb-${categoryId}-3`,
        title: `Comprehensive Care Package`,
        price: '₹1,500',
        image: 'https://cdn-icons-png.flaticon.com/512/865/865969.png',
        type: 'package',
        description: `All-inclusive health checkup and consultation package.`,
      },
    ],
    defaultDoctors: [
      {
        id: `doc-${categoryId}-1`,
        name: 'Dr. Ramesh Verma',
        speciality: `${categoryId.charAt(0).toUpperCase() + categoryId.slice(1)} Specialist`,
        emoji: '🩺',
        fee: '800',
        hospitalName: 'Apollo Hospitals, Bengaluru',
        location: 'Bengaluru, Karnataka',
        languages: 'English • Hindi • Kannada',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400',
        availableSlots: ['10:00 AM', '12:30 PM', '05:00 PM'],
        nextAvailableTime: '10:00 AM',
      },
      {
        id: `doc-${categoryId}-2`,
        name: 'Dr. Ananya Sharma',
        speciality: `${categoryId.charAt(0).toUpperCase() + categoryId.slice(1)} Consultant`,
        emoji: '🩺',
        fee: '900',
        hospitalName: 'Manipal Hospital, Bengaluru',
        location: 'Bengaluru, Karnataka',
        languages: 'English • Hindi',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400',
        availableSlots: ['09:30 AM', '01:00 PM', '06:30 PM'],
        nextAvailableTime: '09:30 AM',
      },
    ],
    packageFilterCategories: [
      { id: 'all', name: 'All Packages' },
      { id: 'specialist', name: 'Specialist Plans' },
      { id: 'rehab', name: 'Rehab & Recovery' },
    ],
    packages: [
      {
        id: `${categoryId}-pkg-1`,
        title: `Complete ${categoryId.toUpperCase()} Health & Recovery Plan`,
        subtitle: `Specialist review, diagnostic scans & personalized therapy`,
        subCategory: 'specialist',
        price: '₹18,999',
        originalPrice: '₹25,999',
        discount: 'Save 27%',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600',
        inclusions: ['Specialist Consult', 'Diagnostic Scans', 'Followup Care', 'Medication Guide'],
      },
      {
        id: `${categoryId}-pkg-2`,
        title: `Advanced ${categoryId.toUpperCase()} Surgery & In-Clinic Treatment`,
        subtitle: `Comprehensive daycare surgery, procedure stay & post-op rehab`,
        subCategory: 'rehab',
        price: '₹1,25,000',
        originalPrice: '₹1,50,000',
        discount: 'Save ₹25,000',
        image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=600',
        inclusions: ['Surgery Procedure', 'Room Stay', 'Physiotherapy', 'Doctor Followups'],
      },
    ],
  };

  const [activeTab, setActiveTab] = useState('Doctors');

  // Doctor Filter States
  const [selectedSpecialty, setSelectedSpecialty] = useState(categoryConfig.specialtyName);
  const [isHighlyRecommended, setIsHighlyRecommended] = useState(false);
  const [isAvailableToday, setIsAvailableToday] = useState(false);
  const [isSectionCollapsed, setIsSectionCollapsed] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [likedDocs, setLikedDocs] = useState<Record<string, boolean>>({});
  const [selectedDoctorForVisit, setSelectedDoctorForVisit] = useState<any>(null);
  const [selectedPackageForAdd, setSelectedPackageForAdd] = useState<any>(null);

  // Package Filter States
  const [activePackageSubFilter, setActivePackageSubFilter] = useState('all');

  const toggleDocLike = (docId: string) => {
    setLikedDocs((prev) => ({ ...prev, [docId]: !prev[docId] }));
  };

  // Doctors filtering
  const doctorsList = useMemo(() => {
    return categoryConfig.defaultDoctors.filter((doc) => {
      const recommendMatch = !isHighlyRecommended || Number(doc.fee) >= 800;
      const todayMatch = !isAvailableToday || (doc.availableSlots && doc.availableSlots.length > 0);
      return recommendMatch && todayMatch;
    });
  }, [categoryConfig.defaultDoctors, isHighlyRecommended, isAvailableToday]);

  // Packages filtering for this category ONLY
  const filteredCategoryPackages = useMemo(() => {
    if (activePackageSubFilter === 'all') {
      return categoryConfig.packages;
    }
    return categoryConfig.packages.filter((pkg) => pkg.subCategory === activePackageSubFilter);
  }, [categoryConfig.packages, activePackageSubFilter]);

  const handleDoctorPress = (doctor: DoctorData) => {
    setSelectedDoctorForVisit(doctor);
  };

  const handleBookVisit = (doctor: DoctorData, selectedSlot?: string, patient?: any, count?: number) => {
    setSelectedDoctorForVisit(doctor);
  };

  const handleFrequentlyBookedPress = (item: FrequentlyBookedItem) => {
    addCartItem({
      type: item.type === 'package' ? 'package' : 'visit',
      itemId: item.id,
      title: item.title,
      subtitle: categoryConfig.title,
      price: Number(item.price.replace(/[^0-9]/g, '')) || 800,
      image: item.image,
      selectedDate: 'Today',
      selectedTime: '10:00 AM',
      hospitalName: 'Arogyon Clinic',
    });
  };

  const handleAddPackage = (pkg: any) => {
    setSelectedPackageForAdd(pkg);
  };

  const renderDoctorsList = () => (
    <View style={styles.tabContent}>
      {/* 1. Filter chips bar */}
      <HospitalFilterBar
        selectedSpecialty={selectedSpecialty}
        isHighlyRecommended={isHighlyRecommended}
        isAvailableToday={isAvailableToday}
        onToggleHighlyRecommended={() => setIsHighlyRecommended(!isHighlyRecommended)}
        onToggleAvailableToday={() => setIsAvailableToday(!isAvailableToday)}
        onOpenFilterModal={() => setShowFilterModal(true)}
        onOpenSpecialtyModal={() => setShowCategoryModal(true)}
        categoryEmoji={categoryConfig.emoji}
      />

      {/* 2. Frequently booked together horizontal carousel */}
      <FrequentlyBookedSection
        items={categoryConfig.frequentlyBooked}
        onItemPress={handleFrequentlyBookedPress}
      />

      {/* 3. Recommended doctors Header with Collapsible chevron */}
      <View style={styles.recommendedHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Recommended doctors
        </Text>

        <TouchableOpacity
          onPress={() => setIsSectionCollapsed(!isSectionCollapsed)}
          style={styles.collapseBtn}
          activeOpacity={0.7}
        >
          {isSectionCollapsed ? (
            <ChevronDown size={20} color={colors.text} />
          ) : (
            <ChevronUp size={20} color={colors.text} />
          )}
        </TouchableOpacity>
      </View>

      {/* 4. Doctors List with exact wireframe */}
      {!isSectionCollapsed && (
        <View style={styles.doctorListContainer}>
          {doctorsList.map((doc) => (
            <RecommendedDoctorCard
              key={doc.id}
              doctor={doc}
              onBookVisitPress={handleBookVisit}
              onCardPress={handleDoctorPress}
              hideLocation={false}
            />
          ))}
        </View>
      )}
    </View>
  );

  const renderPackagesList = () => (
    <View style={styles.tabContent}>
      {/* 1. Top Framed Section Heading for Health Packages matching reference screenshot */}
      <View style={styles.packagesHeadingContainer}>
        <View style={styles.packagesHeadingDivider}>
          <View style={[styles.headingLine, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#CBD5E1' }]} />
          <View style={[styles.headingBadge, { backgroundColor: isDark ? '#1E293B' : '#E0F2FE' }]}>
            <Sparkles size={14} color={isDark ? '#38BDF8' : '#0284C7'} />
            <Text style={[styles.headingBadgeText, { color: isDark ? '#38BDF8' : '#0369A1' }]}>
              HEALTH PACKAGES
            </Text>
          </View>
          <View style={[styles.headingLine, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#CBD5E1' }]} />
        </View>

        <Text style={[styles.packagesMainTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          Specialized Packages & Surgery Care
        </Text>
        <Text style={[styles.packagesSubTitle, { color: isDark ? '#9CA3AF' : '#64748B' }]}>
          Comprehensive checkups, maternity suites & recovery plans with transparent pricing
        </Text>
      </View>

      {/* 2. Sub-Category Filter Chips of this Specific Category ONLY */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.packagePillsScroll}
      >
        {categoryConfig.packageFilterCategories.map((cat) => {
          const isActive = activePackageSubFilter === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.packageFilterChip,
                {
                  backgroundColor: isActive ? (isDark ? '#2E1065' : '#F3E8FF') : (isDark ? '#1E1E24' : '#FFFFFF'),
                  borderColor: isActive ? '#7C3AED' : (isDark ? '#333333' : '#E2E8F0'),
                },
              ]}
              onPress={() => setActivePackageSubFilter(cat.id)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.packageFilterChipText,
                  { color: isActive ? '#7C3AED' : (isDark ? '#E2E8F0' : '#1E293B'), fontWeight: isActive ? '700' : '600' },
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 3. Section Group Header with Badge Count */}
      <View style={styles.packageSectionHeader}>
        <Text style={[styles.packageSectionTitle, { color: colors.text }]}>
          {activePackageSubFilter === 'all'
            ? `${categoryConfig.title} Packages`
            : categoryConfig.packageFilterCategories.find((c) => c.id === activePackageSubFilter)?.name}
        </Text>
        <View style={[styles.categoryBadgeCount, { backgroundColor: isDark ? '#2E1065' : '#F3E8FF' }]}>
          <Text style={[styles.categoryBadgeCountText, { color: '#7C3AED' }]}>
            {filteredCategoryPackages.length} {filteredCategoryPackages.length === 1 ? 'Package' : 'Packages'}
          </Text>
        </View>
      </View>

      {/* 4. Exact Horizontal Wireframe Cards for THIS Category */}
      <View style={styles.packagesListContainer}>
        {filteredCategoryPackages.map((pkg) => (
          <PackageItemCard
            key={pkg.id}
            item={pkg}
            layout="horizontal"
            variant="hospital"
            onPress={() => setSelectedPackageForAdd(pkg)}
            onAddPress={handleAddPackage}
          />
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#FDFDFD' }}>
      <CategoryHeader
        title={categoryConfig.title}
        subtitle={categoryConfig.subtitle}
        icon={categoryConfig.icon}
        location="Bengaluru, Karnataka"
        isDark={isDark}
        colors={colors}
      />

      <CategoryTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        colors={colors}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'Doctors' && renderDoctorsList()}
        {activeTab === 'Packages' && renderPackagesList()}
      </ScrollView>

      {/* Specialty Filter Modal */}
      {showCategoryModal && (
        <Modal
          visible={showCategoryModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalCard,
                { backgroundColor: isDark ? '#1E1E24' : '#FFFFFF' },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Select Specialty
                </Text>
                <TouchableOpacity
                  onPress={() => setShowCategoryModal(false)}
                  style={styles.closeBtn}
                >
                  <X size={20} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
                {ALL_SPECIALTIES.map((item) => {
                  const isSelected = selectedSpecialty === item.name || selectedSpecialty === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.modalItemRow,
                        isSelected && { backgroundColor: isDark ? '#2E1065' : '#FEF2F2' },
                      ]}
                      onPress={() => {
                        setSelectedSpecialty(item.name);
                        setShowCategoryModal(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.modalItemText,
                          {
                            color: isSelected ? '#E11D48' : colors.text,
                            fontWeight: isSelected ? '800' : '600',
                          },
                        ]}
                      >
                        {item.name}
                      </Text>
                      {isSelected && <CheckCircle2 size={18} color="#E11D48" />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Filters Modal */}
      {showFilterModal && (
        <Modal
          visible={showFilterModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowFilterModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalCard,
                { backgroundColor: isDark ? '#1E1E24' : '#FFFFFF' },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Filter Doctors
                </Text>
                <TouchableOpacity
                  onPress={() => setShowFilterModal(false)}
                  style={styles.closeBtn}
                >
                  <X size={20} color={colors.text} />
                </TouchableOpacity>
              </View>

              <View style={{ paddingVertical: 10, gap: 12 }}>
                <TouchableOpacity
                  style={[
                    styles.modalFilterOption,
                    isHighlyRecommended && { backgroundColor: isDark ? '#31121F' : '#FFF1F2' },
                  ]}
                  onPress={() => setIsHighlyRecommended(!isHighlyRecommended)}
                >
                  <Text style={[styles.modalOptionText, { color: colors.text }]}>
                    ⭐ Highly Recommended Only
                  </Text>
                  {isHighlyRecommended && <CheckCircle2 size={18} color="#E11D48" />}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalFilterOption,
                    isAvailableToday && { backgroundColor: isDark ? '#31121F' : '#FFF1F2' },
                  ]}
                  onPress={() => setIsAvailableToday(!isAvailableToday)}
                >
                  <Text style={[styles.modalOptionText, { color: colors.text }]}>
                    📅 Available Today Only
                  </Text>
                  {isAvailableToday && <CheckCircle2 size={18} color="#E11D48" />}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={() => setShowFilterModal(false)}
                >
                  <Text style={styles.applyBtnText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Add Visit Slot Modal Popup */}
      {!!selectedDoctorForVisit && (
        <AddVisitModal
          visible={!!selectedDoctorForVisit}
          doctor={selectedDoctorForVisit}
          hospitalName={selectedDoctorForVisit?.hospitalName || categoryConfig.title}
          onClose={() => setSelectedDoctorForVisit(null)}
        />
      )}

      {/* Add Package Modal Popup */}
      {!!selectedPackageForAdd && (
        <AddPackageModal
          visible={!!selectedPackageForAdd}
          packageItem={selectedPackageForAdd}
          hospitalName={selectedPackageForAdd?.hospitalName || 'Arogyon Partner Hospital'}
          onClose={() => setSelectedPackageForAdd(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  tabContent: {
    paddingVertical: 4,
  },
  recommendedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16.5,
    fontWeight: '600',
    letterSpacing: -0.15,
  },
  collapseBtn: {
    padding: 4,
  },
  doctorListContainer: {
    paddingHorizontal: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  modalTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    fontWeight: '600',
  },
  closeBtn: {
    padding: 2,
  },
  modalItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginVertical: 2,
  },
  modalItemText: {
    fontSize: 14,
  },
  modalFilterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  applyBtn: {
    backgroundColor: '#E11D48',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  packagesHeadingContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  packagesHeadingDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  headingLine: {
    flex: 1,
    height: 1,
  },
  headingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  headingBadgeText: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  packagesMainTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  packagesSubTitle: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 320,
  },
  packagePillsScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  packageFilterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  packageFilterChipText: {
    fontSize: 12.5,
    fontFamily: Fonts.medium,
  },
  packageSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 4,
  },
  packageSectionTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16.5,
    fontWeight: '600',
    letterSpacing: -0.15,
  },
  categoryBadgeCount: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryBadgeCountText: {
    fontFamily: Fonts.semiBold,
    fontSize: 11,
    fontWeight: '600',
  },
  packagesListContainer: {
    paddingHorizontal: 0,
  },
});
