import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text, Platform, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import Animated, { useAnimatedScrollHandler, useSharedValue, FadeInUp, SlideInDown } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight, Star, SlidersHorizontal, ShoppingBag, X, Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 240;

export interface Package {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  rating: string;
  duration: string;
  tag: string;
  image: string;
  description: string;
}

export interface Catalog {
  title: string;
  bannerImage: string;
  offer: string;
  packages: Package[];
}

export const CATALOG_DATA: Record<string, Catalog> = {
  pregnancy: {
    title: "Pregnancy Care Plans",
    bannerImage: "https://images.unsplash.com/photo-1544126592-807ade215a0b?q=80&w=800",
    offer: "50% OFF UP TO ₹1,500 UNLOCKED",
    packages: [
      {
        id: "preg-basic",
        title: "Trimester 1 Starter Plan",
        subtitle: "Essential clinical care & dietitian support",
        price: "₹2,499",
        rating: "4.8",
        duration: "12 Weeks",
        tag: "Free Scans Included",
        image: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?q=80&w=400",
        description: "Includes monthly checkups, trimester scan schedules, and personalized vitamins tracking."
      },
      {
        id: "preg-standard",
        title: "Standard Trimester 1 & 2 Care",
        subtitle: "Mid-term tracking & safe wellness guides",
        price: "₹4,999",
        rating: "4.9",
        duration: "28 Weeks",
        tag: "Most Popular",
        image: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=400",
        description: "Adds customized pregnancy yoga lessons and a personalized gestational diabetes screening plan."
      },
      {
        id: "preg-premium",
        title: "Premium Full Term Support",
        subtitle: "9 Months complete care with delivery prep",
        price: "₹8,499",
        rating: "4.9",
        duration: "40 Weeks",
        tag: "Recommended",
        image: "https://images.unsplash.com/photo-1519068737630-e5db30e12e42?q=80&w=400",
        description: "Adds Lamaze prep classes, unlimited 24/7 pediatrician chat, and pediatric consult vouchers."
      }
    ]
  },
  'weight-loss': {
    title: "Weight Loss Plans",
    bannerImage: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800",
    offer: "30% OFF UP TO ₹800 UNLOCKED",
    packages: [
      {
        id: "weight-diet",
        title: "Diet & Habit Kickstart",
        subtitle: "Personal nutritionist & habit assessments",
        price: "₹1,499",
        rating: "4.6",
        duration: "30 Days",
        tag: "Budget Choice",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=400",
        description: "Focuses on daily calorie checks, custom meal planning, and weekly diet check-ins."
      },
      {
        id: "weight-active",
        title: "Active Workout & Nutrition Plan",
        subtitle: "Structured routines & continuous reviews",
        price: "₹2,499",
        rating: "4.8",
        duration: "90 Days",
        tag: "Best Results",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400",
        description: "Adds high-intensity cardio plans, home weight guide exercises, and monthly metabolism reviews."
      },
      {
        id: "weight-elite",
        title: "Elite Coaching & Tracker Access",
        subtitle: "Unlimited nutritionist consultations",
        price: "₹3,999",
        rating: "4.9",
        duration: "180 Days",
        tag: "Premium Care",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400",
        description: "Adds bi-weekly metabolic assessments, premium trainer chats, and smart calorie analytics."
      }
    ]
  },
  'stress-relief': {
    title: "Stress Relief Plans",
    bannerImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800",
    offer: "40% OFF UP TO ₹500 UNLOCKED",
    packages: [
      {
        id: "stress-basic",
        title: "Mindfulness & Yoga Basics",
        subtitle: "Daily guided audio & stretching classes",
        price: "₹599",
        rating: "4.7",
        duration: "14 Days",
        tag: "Quick Start",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400",
        description: "Includes morning breathing exercises, quick focus recovery audio, and daily stretch lists."
      },
      {
        id: "stress-sleep",
        title: "Deep Sleep & Anxiety Management",
        subtitle: "Private consultations & relaxation guides",
        price: "₹1,499",
        rating: "4.9",
        duration: "30 Days",
        tag: "Sleep Special",
        image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=400",
        description: "Adds anxiety scale assessments, custom calming diets, and weekly wellness coaching."
      },
      {
        id: "stress-complete",
        title: "90-Day Well-Being Journey",
        subtitle: "End to end clinical counseling & therapy",
        price: "₹3,499",
        rating: "4.9",
        duration: "90 Days",
        tag: "Top Rated",
        image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=400",
        description: "Adds monthly certified counselor consultations, 24/7 emergency support, and group healing."
      }
    ]
  },
  'joint-health': {
    title: "Joint Health Plans",
    bannerImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800",
    offer: "25% OFF UP TO ₹1,200 UNLOCKED",
    packages: [
      {
        id: "joint-pain",
        title: "Pain Management & Mobility",
        subtitle: "Physiotherapist guides & range trackers",
        price: "₹1,299",
        rating: "4.7",
        duration: "15 Days",
        tag: "Mobility Basic",
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=400",
        description: "Focuses on daily pain level assessments, posture training, and range-of-motion routines."
      },
      {
        id: "joint-rehab",
        title: "Standard Post-Surgery Rehab",
        subtitle: "Physiotherapist checkins & strength phases",
        price: "₹4,999",
        rating: "4.9",
        duration: "45 Days",
        tag: "Surgical Recovery",
        image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=400",
        description: "Adds weekly physical assessment sessions, surgical progress checks, and heat/ice recipes."
      },
      {
        id: "joint-chronic",
        title: "Chronic Pain Strength Program",
        subtitle: "Complete clinical orthopedic care plan",
        price: "₹8,999",
        rating: "4.9",
        duration: "90 Days",
        tag: "Maximum Care",
        image: "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?q=80&w=400",
        description: "Adds 24/7 unlimited orthopedic nurse consultations, custom braces advice, and physio chat."
      }
    ]
  },
  diabetes: {
    title: "Diabetes Control Plans",
    bannerImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800",
    offer: "40% OFF UP TO ₹1,000 UNLOCKED",
    packages: [
      {
        id: "diab-basic",
        title: "Sugar Level Kickstart",
        subtitle: "Daily glucose logging & dietitian consultation",
        price: "₹1,299",
        rating: "4.6",
        duration: "30 Days",
        tag: "Starter Plan",
        image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=400",
        description: "Includes low-GI diet guidance, target workouts list, and weekly blood sugar trends reviews."
      },
      {
        id: "diab-standard",
        title: "90-Day Complete Sugar Control",
        subtitle: "Diabetologist support & continuous coaching",
        price: "₹3,499",
        rating: "4.9",
        duration: "90 Days",
        tag: "Highly Recommended",
        image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=400",
        description: "Adds blood glucose monitor syncing, monthly diabetologist reviews, and diabetic snack recipes."
      }
    ]
  },
  'skin-care': {
    title: "Advanced Skin Care Plans",
    bannerImage: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=800",
    offer: "30% OFF UP TO ₹700 UNLOCKED",
    packages: [
      {
        id: "skin-acne",
        title: "Acne & Oil Balance",
        subtitle: "Skin assessment & customized routines",
        price: "₹1,499",
        rating: "4.7",
        duration: "45 Days",
        tag: "Acne Special",
        image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=400",
        description: "Focuses on morning/night skin cleansing schedules, product safety guides, and diet rules."
      },
      {
        id: "skin-glow",
        title: "12-Week Premium Skincare Journey",
        subtitle: "Dermatologist approvals & glow diets",
        price: "₹2,499",
        rating: "4.9",
        duration: "84 Days",
        tag: "Dermatologist Approved",
        image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=400",
        description: "Adds bi-weekly dermatologist consultations, progress photo scans, and direct text expert chat."
      }
    ]
  },
  orthopedic: {
    title: "Orthopedic Surgery Care",
    bannerImage: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=800",
    offer: "UP TO ₹25,000 INSURANCE COVERED",
    packages: [
      {
        id: "ortho-knee",
        title: "Total Knee Replacement",
        subtitle: "Complete joint restoration with premium implant",
        price: "₹1,25,000",
        rating: "4.9",
        duration: "3 Days Stay",
        tag: "Best Seller",
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=400",
        description: "Features premium FDA-approved implants, robotic navigation assistant, and 6 weeks home rehabilitation."
      },
      {
        id: "ortho-spine",
        title: "Spine Microdiscectomy",
        subtitle: "Advanced laser spine decompression",
        price: "₹1,80,000",
        rating: "5.0",
        duration: "2 Days Stay",
        tag: "Advanced Tech",
        image: "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?q=80&w=400",
        description: "Microscopic nerve decompression, top neuro-spine surgeons, and 3 months comprehensive rehabilitation care."
      }
    ]
  },
  cardiac: {
    title: "Cardiac Surgery Care",
    bannerImage: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=800",
    offer: "100% Cashless Insurance Accepted",
    packages: [
      {
        id: "card-angio",
        title: "Coronary Angioplasty (PTCA)",
        subtitle: "Single drug-eluting stent placement",
        price: "₹95,000",
        rating: "4.8",
        duration: "1 Day Stay",
        tag: "Standard Care",
        image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=400",
        description: "Includes premium FDA-approved stent, ICU monitoring, and 3 cardiologist follow-ups."
      },
      {
        id: "card-cabg",
        title: "CABG (Open Heart Bypass)",
        subtitle: "Multi-vessel arterial grafting",
        price: "₹2,60,000",
        rating: "4.9",
        duration: "5 Days Stay",
        tag: "Most Recommended",
        image: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=400",
        description: "Beating heart bypass surgery, standard post-op cardiac rehab, and lifetime medication planning guide."
      }
    ]
  },
  neuro: {
    title: "Neuro Surgery Care",
    bannerImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=800",
    offer: "Zero Cost EMI Plans Available",
    packages: [
      {
        id: "neuro-crani",
        title: "Brain Tumor Resection",
        subtitle: "Precision neuro-navigation guided removal",
        price: "₹2,80,000",
        rating: "4.9",
        duration: "5 Days Stay",
        tag: "Robotic Guided",
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=400",
        description: "Under high-end operating microscope, ICU stay included, and neurological rehab course."
      }
    ]
  },
  general: {
    title: "General Surgery Care",
    bannerImage: "https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=800",
    offer: "Flat 20% Cashback on Diagnostics",
    packages: [
      {
        id: "gen-hernia",
        title: "Laparoscopic Hernia Repair",
        subtitle: "Keyhole surgery with premium mesh",
        price: "₹45,000",
        rating: "4.8",
        duration: "1 Day Stay",
        tag: "Minimally Invasive",
        image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=400",
        description: "Includes surgical mesh, surgeon fees, and post-op healing guides."
      },
      {
        id: "gen-chole",
        title: "Laparoscopic Cholecystectomy",
        subtitle: "Gallbladder removal procedure",
        price: "₹55,000",
        rating: "4.9",
        duration: "1 Day Stay",
        tag: "Fast Recovery",
        image: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=400",
        description: "Complete keyhole gallbladder excision, recovery tracking app, and custom post-op diet support."
      }
    ]
  },
  ent: {
    title: "ENT Surgery Care",
    bannerImage: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=800",
    offer: "Free Pre-Op Specialist Consult",
    packages: [
      {
        id: "ent-tonsil",
        title: "Tonsillectomy",
        subtitle: "Laser/Coblation tonsil removal",
        price: "₹30,000",
        rating: "4.8",
        duration: "Day Care",
        tag: "Painless Laser",
        image: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=400",
        description: "Coblation-guided tissue removal, soft-diet plans, and pediatric-friendly support options."
      }
    ]
  },
  urology: {
    title: "Urology Surgery Care",
    bannerImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800",
    offer: "100% Confidential & Expert Care",
    packages: [
      {
        id: "uro-stone",
        title: "Laser Kidney Stone Removal (URSL)",
        subtitle: "Advanced laser fragmentation",
        price: "₹50,000",
        rating: "4.8",
        duration: "Day Care",
        tag: "Stent Included",
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=400",
        description: "Holmium laser fragmentation, DJ stent placement & removal, and custom hydration tracker."
      }
    ]
  }
};

const getCatalogData = (id: string) => {
  const normId = String(id).toLowerCase();
  if (normId === '1' || normId === 'pregnancy') return CATALOG_DATA.pregnancy;
  if (normId === '2' || normId === 'weight-loss') return CATALOG_DATA['weight-loss'];
  if (normId === '3' || normId === 'stress-relief' || normId === 'yoga') return CATALOG_DATA['stress-relief'];
  if (normId === '4' || normId === 'joint-health' || normId === 'rehab') return CATALOG_DATA['joint-health'];
  if (normId === 'diabetes') return CATALOG_DATA.diabetes;
  if (normId === 'skin-care') return CATALOG_DATA['skin-care'];
  if (normId === 'orthopedic') return CATALOG_DATA.orthopedic;
  if (normId === 'cardiac') return CATALOG_DATA.cardiac;
  if (normId === 'neuro') return CATALOG_DATA.neuro;
  if (normId === 'general') return CATALOG_DATA.general;
  if (normId === 'ent') return CATALOG_DATA.ent;
  if (normId === 'urology') return CATALOG_DATA.urology;
  return CATALOG_DATA['joint-health']; // fallback
};

const getCardColors = (pkgId: string, index: number): [string, string] => {
  const gradients: [string, string][] = [
    ['#EDF1FD', '#D6E2FA'],
    ['#FFF0EA', '#FCE1D5'],
    ['#F3EDFF', '#E4D6FA'],
    ['#EBF5FA', '#D0EAF6'],
    ['#FCF0F0', '#F7DEDE'],
    ['#ECF9F8', '#D3F2EF'],
  ];
  return gradients[index % gradients.length];
};

export const findPackageById = (id: string): { pkg: Package; catalog: Catalog } | null => {
  for (const key in CATALOG_DATA) {
    const catalog = CATALOG_DATA[key];
    const pkg = catalog.packages.find(p => p.id === id);
    if (pkg) {
      return { pkg, catalog };
    }
  }
  return null;
};

export default function PlanDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const catalog = getCatalogData(id ? String(id) : 'pregnancy');
  
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filters = ['All', 'Popular', 'Budget', 'Premium'];

  const filteredPackages = useMemo(() => {
    return catalog.packages.filter((pkg) => {
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Popular') return parseFloat(pkg.rating) >= 4.8;
      if (activeFilter === 'Budget') {
        const value = parseInt(pkg.price.replace(/[^\d]/g, ''));
        return value <= 2500;
      }
      if (activeFilter === 'Premium') {
        const value = parseInt(pkg.price.replace(/[^\d]/g, ''));
        return value > 2500;
      }
      return true;
    });
  }, [catalog, activeFilter]);

  const handleSelectPackage = (pkg: Package) => {
    if (selectedPackage?.id === pkg.id) {
      setSelectedPackage(null);
    } else {
      setSelectedPackage(pkg);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: isDark ? '#121212' : '#FDFDFD' }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Back Button (Overlaid on top left of banner) */}
      <TouchableOpacity 
        style={[styles.backButton, { top: insets.top + 10 }]} 
        activeOpacity={0.8}
        onPress={() => router.back()}
      >
        <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2.5} />
      </TouchableOpacity>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner Promo Section */}
        <View style={styles.bannerContainer}>
          <Image source={{ uri: catalog.bannerImage }} style={styles.bannerImage} />
          {/* Overlay Darkening Gradient */}
          <View style={styles.gradientOverlay} />

          {/* Banner Promo Text Content */}
          <View style={[styles.bannerTextContent, { bottom: 24 }]}>
            <Text style={styles.promoOfferText}>{catalog.offer}</Text>
            <Text style={styles.promoSubText}>Ends Tomorrow</Text>
          </View>
        </View>

        {/* Category Header */}
        <View style={styles.headerBlock}>
          <View style={styles.headerLine} />
          <Text style={[styles.headerText, { color: colors.text }]}>{catalog.title}</Text>
          <View style={styles.headerLine} />
        </View>

        {/* Filter Pills */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          <View style={[styles.filterPill, styles.filterStatic, { borderColor: isDark ? '#333' : '#E5E7EB' }]}>
            <SlidersHorizontal size={12} color={isDark ? '#FFF' : '#374151'} />
            <Text style={[styles.filterText, { color: colors.text, marginLeft: 4 }]}>Filters</Text>
          </View>
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterPill,
                  isActive ? styles.filterActive : { borderColor: isDark ? '#333' : '#E5E7EB' }
                ]}
                onPress={() => setActiveFilter(filter)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterText, { color: isActive ? '#FFFFFF' : colors.text }]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Plan Cards List */}
        <View style={styles.listContainer}>
          {filteredPackages.map((pkg, index) => {
            const cardColors = getCardColors(pkg.id, index);
            
            return (
              <TouchableOpacity
                key={pkg.id} 
                activeOpacity={0.9}
                onPress={() => router.push(`/plan/package/${pkg.id}`)}
                style={styles.horizontalCardWrapper}
              >
                <LinearGradient
                  colors={cardColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.horizontalCard}
                >
                  {/* Left content */}
                  <View style={styles.horizontalCardLeft}>
                    <View style={styles.horizontalCardHeader}>
                      {pkg.tag ? (
                        <View style={styles.tagBadge}>
                          <Text style={styles.tagBadgeText}>{pkg.tag}</Text>
                        </View>
                      ) : null}
                      <Text style={styles.horizontalCardTitle} numberOfLines={1}>{pkg.title}</Text>
                      <Text style={styles.horizontalCardSubtitle} numberOfLines={1}>{pkg.subtitle}</Text>
                    </View>

                    <View style={styles.horizontalCardMetaRow}>
                      <View style={styles.metaBadge}>
                        <Text style={styles.metaBadgeText}>{pkg.duration}</Text>
                      </View>
                      <View style={styles.horizontalRatingBadge}>
                        <Star size={10} color="#047857" fill="#047857" />
                        <Text style={styles.horizontalRatingText}>{pkg.rating}</Text>
                      </View>
                    </View>

                    <View style={styles.horizontalCardFooter}>
                      <Text style={styles.horizontalPriceVal}>{pkg.price}</Text>
                      <View style={styles.arrowIconCircle}>
                        <ArrowRight size={14} color="#FFFFFF" strokeWidth={3} />
                      </View>
                    </View>
                  </View>

                  {/* Right Faded Image */}
                  <View style={styles.horizontalImageContainer}>
                    <LinearGradient 
                      colors={[cardColors[0], 'transparent']} 
                      start={{ x: 0, y: 0 }} 
                      end={{ x: 0.6, y: 0 }} 
                      style={styles.horizontalImageGradientOverlay} 
                    />
                    <Image source={{ uri: pkg.image }} style={styles.horizontalImage} resizeMode="cover" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.bottomOffset} />
      </ScrollView>
    </View>
  );
}

const styles: any = StyleSheet.create({
  screen: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  bannerContainer: {
    height: HEADER_HEIGHT,
    width: '100%',
    position: 'relative',
    backgroundColor: '#000',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  bannerTextContent: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  promoOfferText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ADFF2F', // Vibrant lime green HSL match
    textAlign: 'center',
    letterSpacing: -0.5,
    textTransform: 'uppercase',
  },
  promoSubText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
  headerBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    paddingHorizontal: 24,
  },
  headerLine: {
    height: 1,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    paddingHorizontal: 12,
  },
  filtersScroll: {
    maxHeight: 40,
    marginBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  filterStatic: {
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  filterActive: {
    backgroundColor: '#005b41',
    borderColor: '#005b41',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: 12,
  },
  planCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImageContainer: {
    height: 160,
    width: '100%',
    position: 'relative',
    backgroundColor: '#F3F4F6',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardTagLeft: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#005b41',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  cardTagRight: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardTagTextRight: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  cardBody: {
    padding: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#047857',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 3,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  priceVal: {
    fontSize: 18,
    fontWeight: '900',
  },
  durationVal: {
    fontSize: 11,
    fontWeight: '500',
  },
  selectBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectBtnActive: {
    backgroundColor: '#10B981',
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  bottomOffset: {
    height: 100,
  },
  
  // Floating Cart/Checkout bar
  checkoutBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 34 : 24,
    left: 12,
    right: 12,
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 999,
  },
  checkoutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  cartIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(225, 29, 72, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutTitle: {
    fontSize: 12,
    fontWeight: '700',
    maxWidth: width * 0.4,
  },
  checkoutPrice: {
    fontSize: 13,
    fontWeight: '900',
    color: '#E11D48',
  },
  checkoutRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkoutBtn: {
    backgroundColor: '#E11D48',
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  closeCheckout: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalCardWrapper: {
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  horizontalCard: {
    height: 140,
    borderRadius: 18,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  horizontalCardLeft: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  horizontalCardHeader: {
    gap: 2,
  },
  tagBadge: {
    backgroundColor: 'rgba(4, 120, 87, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  tagBadgeText: {
    color: '#047857',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  horizontalCardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1a1a1a',
  },
  horizontalCardSubtitle: {
    fontSize: 11,
    color: '#4a4a4a',
    fontWeight: '600',
  },
  horizontalCardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  metaBadgeText: {
    fontSize: 10,
    color: '#4b5563',
    fontWeight: '700',
  },
  horizontalRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  horizontalRatingText: {
    color: '#047857',
    fontSize: 10,
    fontWeight: '700',
  },
  horizontalCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horizontalPriceVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1a1a1a',
  },
  smallSelectBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallSelectBtnActive: {
    backgroundColor: '#10B981',
  },
  smallSelectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  smallSelectBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  horizontalImageContainer: {
    width: '38%',
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
  },
  horizontalImage: {
    width: '100%',
    height: '100%',
  },
  horizontalImageGradientOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  arrowIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#047857',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  }
});
