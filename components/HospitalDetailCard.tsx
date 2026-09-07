import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { Heart, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { resolveImageSource } from '@/utils/imageUtils';
import { LinearGradient } from 'expo-linear-gradient';
import OfferBadgeIcon from '@/components/ui/OfferBadgeIcon';

const CATEGORY_ICON_MAP: Record<string, any> = {
  general: require('@/assets/images/category-icons/general-physician.png'),
  womens: require('@/assets/images/category-icons/womens-health.png'),
  skin: require('@/assets/images/category-icons/skin-specialist.png'),
  child: require('@/assets/images/category-icons/child-care.png'),
  dentist: require('@/assets/images/category-icons/dentist.png'),
  eye: require('@/assets/images/category-icons/eye-specialist.png'),
  ent: require('@/assets/images/category-icons/ent.png'),
  mental: require('@/assets/images/category-icons/mental-wellness.png'),
  bones: require('@/assets/images/category-icons/bones-joints.png'),
  brain: require('@/assets/images/category-icons/brain-nerves.png'),
  urinary: require('@/assets/images/category-icons/urinary-issues.png'),
  lungs: require('@/assets/images/category-icons/lungs-breathing.png'),
  heart: require('@/assets/images/category-icons/heart-specialist.png'),
  stomach: require('@/assets/images/category-icons/stomach-digestion.png'),
  diabetes: require('@/assets/images/category-icons/diabetes.png'),
  cancer: require('@/assets/images/category-icons/cancer-specialist.png'),
  hair: require('@/assets/images/category-icons/hair.png'),
  plastic: require('@/assets/images/category-icons/plastic-surgery.png'),
  mens: require('@/assets/images/category-icons/mens-health.png'),
  veterinary: require('@/assets/images/category-icons/veterinary.png'),
};

interface DeptIconItem {
  icon: any;
  bgLight: string;
  bgDark: string;
  label: string;
}

function getDeptIconData(deptName: string): DeptIconItem {
  const name = (deptName || '').toLowerCase();

  if (name.includes('cardio') || name.includes('heart') || name.includes('ecg') || name.includes('bp') || name.includes('cardiac') || name.includes('vascular')) {
    return { icon: CATEGORY_ICON_MAP.heart, bgLight: '#FFEbee', bgDark: '#381E24', label: 'Cardiology' };
  }
  if (name.includes('neuro') || name.includes('brain') || name.includes('stroke') || name.includes('epilepsy') || name.includes('parkinson') || name.includes('migraine') || name.includes('nerve')) {
    return { icon: CATEGORY_ICON_MAP.brain, bgLight: '#EDE7F6', bgDark: '#261F38', label: 'Neurology' };
  }
  if (name.includes('pediatric') || name.includes('child') || name.includes('baby') || name.includes('newborn') || name.includes('neonat') || name.includes('vaccin') || name.includes('infant')) {
    return { icon: CATEGORY_ICON_MAP.child, bgLight: '#E8F5E9', bgDark: '#1A3326', label: 'Pediatrics' };
  }
  if (name.includes('eye') || name.includes('vision') || name.includes('retina') || name.includes('cataract') || name.includes('lasik') || name.includes('cornea') || name.includes('glaucoma') || name.includes('squint') || name.includes('ocular') || name.includes('glasses') || name.includes('lens') || name.includes('optom')) {
    return { icon: CATEGORY_ICON_MAP.eye, bgLight: '#E0F2FE', bgDark: '#172C3D', label: 'Eye Care' };
  }
  if (name.includes('dent') || name.includes('teeth') || name.includes('tooth') || name.includes('canal') || name.includes('orthodont') || name.includes('aligner') || name.includes('braces') || name.includes('implant') || name.includes('smile') || name.includes('scaling') || name.includes('oral')) {
    return { icon: CATEGORY_ICON_MAP.dentist, bgLight: '#FEF3C7', bgDark: '#362E1A', label: 'Dental' };
  }
  if (name.includes('ortho') || name.includes('bone') || name.includes('joint') || name.includes('spine') || name.includes('knee') || name.includes('hip') || name.includes('fracture') || name.includes('ligament') || name.includes('arthritis') || name.includes('physio') || name.includes('rehab') || name.includes('back pain')) {
    return { icon: CATEGORY_ICON_MAP.bones, bgLight: '#F3E8FF', bgDark: '#2B1E38', label: 'Orthopedics' };
  }
  if (name.includes('hair') || name.includes('prp') || name.includes('gfc') || name.includes('transplant') || name.includes('scalp')) {
    return { icon: CATEGORY_ICON_MAP.hair, bgLight: '#FDF2F8', bgDark: '#351C2C', label: 'Hair Care' };
  }
  if (name.includes('skin') || name.includes('derma') || name.includes('acne') || name.includes('pigment') || name.includes('hydrafacial') || name.includes('toning') || name.includes('laser')) {
    return { icon: CATEGORY_ICON_MAP.skin, bgLight: '#FCE7F3', bgDark: '#381C2E', label: 'Dermatology' };
  }
  if (name.includes('gynec') || name.includes('women') || name.includes('maternity') || name.includes('pregnan') || name.includes('fetal') || name.includes('lactat') || name.includes('pcos') || name.includes('fertility') || name.includes('ivf')) {
    return { icon: CATEGORY_ICON_MAP.womens, bgLight: '#FDF2F8', bgDark: '#361D2B', label: 'Gynecology' };
  }
  if (name.includes('cancer') || name.includes('onco') || name.includes('tumor') || name.includes('chemo') || name.includes('radiation')) {
    return { icon: CATEGORY_ICON_MAP.cancer, bgLight: '#FEE2E2', bgDark: '#381C1C', label: 'Oncology' };
  }
  if (name.includes('ent') || name.includes('sinus') || name.includes('ear') || name.includes('nose') || name.includes('throat') || name.includes('hearing') || name.includes('vertigo') || name.includes('voice') || name.includes('skull base')) {
    return { icon: CATEGORY_ICON_MAP.ent, bgLight: '#FEF9C3', bgDark: '#332D15', label: 'ENT Care' };
  }
  if (name.includes('gastro') || name.includes('stomach') || name.includes('digest') || name.includes('gut') || name.includes('liver') || name.includes('hepat') || name.includes('piles') || name.includes('hernia') || name.includes('gallbladder') || name.includes('append')) {
    return { icon: CATEGORY_ICON_MAP.stomach, bgLight: '#ECFDF5', bgDark: '#173627', label: 'Gastroenterology' };
  }
  if (name.includes('uro') || name.includes('kidney') || name.includes('urinar') || name.includes('nephro') || name.includes('stone') || name.includes('dialysis') || name.includes('bladder')) {
    return { icon: CATEGORY_ICON_MAP.urinary, bgLight: '#E0F2FE', bgDark: '#162C3E', label: 'Urology' };
  }
  if (name.includes('lung') || name.includes('pulmo') || name.includes('breath') || name.includes('asthma') || name.includes('sleep') || name.includes('apnea') || name.includes('polysomno') || name.includes('cpap')) {
    return { icon: CATEGORY_ICON_MAP.lungs, bgLight: '#E0E7FF', bgDark: '#1B223D', label: 'Pulmonology' };
  }
  if (name.includes('mental') || name.includes('psych') || name.includes('stress') || name.includes('anxiety') || name.includes('depress') || name.includes('cbt') || name.includes('counsel') || name.includes('insomnia')) {
    return { icon: CATEGORY_ICON_MAP.mental, bgLight: '#F5F3FF', bgDark: '#261F38', label: 'Mental Health' };
  }
  if (name.includes('diabet') || name.includes('sugar') || name.includes('thyroid') || name.includes('nutrit') || name.includes('diet') || name.includes('weight') || name.includes('detox') || name.includes('metabolic') || name.includes('endocrine')) {
    return { icon: CATEGORY_ICON_MAP.diabetes, bgLight: '#ECFCCB', bgDark: '#283318', label: 'Diabetology' };
  }
  if (name.includes('plastic') || name.includes('cosmetic') || name.includes('aesthetic')) {
    return { icon: CATEGORY_ICON_MAP.plastic, bgLight: '#FFF1F2', bgDark: '#381C24', label: 'Plastic Surgery' };
  }
  if (name.includes('vet') || name.includes('pet') || name.includes('animal')) {
    return { icon: CATEGORY_ICON_MAP.veterinary, bgLight: '#FEF3C7', bgDark: '#332D15', label: 'Veterinary' };
  }
  if (name.includes('men') || name.includes('andrology')) {
    return { icon: CATEGORY_ICON_MAP.mens, bgLight: '#E0F2FE', bgDark: '#172C3D', label: "Men's Health" };
  }

  return { icon: CATEGORY_ICON_MAP.general, bgLight: '#F1F5F9', bgDark: '#202632', label: deptName || 'General' };
}

function parseDepartmentIcons(departmentsText?: string, specialityText?: string) {
  const text = departmentsText || specialityText || 'Cardiology • Neurology • +12 more';
  const parts = text.split(/[•,]/).map(p => p.trim()).filter(Boolean);

  let extraCountBadge: string | null = null;
  const validDeptNames: string[] = [];

  for (const part of parts) {
    const match = part.match(/\+(\d+)/);
    if (match) {
      extraCountBadge = `+${match[1]}`;
    } else if (part.toLowerCase().includes('more')) {
      const numMatch = part.match(/(\d+)/);
      if (numMatch) {
        extraCountBadge = `+${numMatch[1]}`;
      }
    } else {
      validDeptNames.push(part);
    }
  }

  if (validDeptNames.length === 0 && specialityText) {
    validDeptNames.push(specialityText);
  }

  const maxIcons = extraCountBadge ? 2 : 3;
  const selectedDeptNames = validDeptNames.slice(0, maxIcons);

  if (!extraCountBadge && validDeptNames.length > 3) {
    extraCountBadge = `+${validDeptNames.length - 2}`;
  }

  const icons: DeptIconItem[] = selectedDeptNames.map(d => getDeptIconData(d));

  if (icons.length === 1 && !extraCountBadge && specialityText) {
    const specIcon = getDeptIconData(specialityText);
    if (specIcon.icon !== icons[0].icon) {
      icons.push(specIcon);
    }
  }

  return {
    icons,
    extraCountBadge,
  };
}

export function getRealLifeHeroBadge(data: {
  heroBadge?: string;
  name?: string;
  departments?: string;
  speciality?: string;
  category?: string;
}): string {
  if (data.heroBadge) return data.heroBadge;

  const text = `${data.name || ''} ${data.departments || ''} ${data.speciality || ''} ${data.category || ''}`.toLowerCase();

  // 1. Kids & Pediatric Emergencies
  if (text.includes('pediatric') || text.includes('child') || text.includes('baby') || text.includes('rainbow') || text.includes('kids')) {
    return 'Pediatrician on Duty · 24/7 Child Care';
  }

  // 2. Teeth & Dental Pain
  if (text.includes('dent') || text.includes('tooth') || text.includes('teeth') || text.includes('clove') || text.includes('partha')) {
    return 'Severe Toothache Relief · Same Day';
  }

  // 3. Eye Emergency & Foreign Body
  if (text.includes('eye') || text.includes('vision') || text.includes('lenskart') || text.includes('cataract') || text.includes('nethralaya') || text.includes('agarwal')) {
    return 'Eye Emergency & Foreign Body Care';
  }

  // 4. Bone, Fracture & Joint Injury
  if (text.includes('bone') || text.includes('ortho') || text.includes('fracture') || text.includes('joint') || text.includes('sparsh') || text.includes('spine')) {
    return 'Fracture & Trauma · X-Ray Ready';
  }

  // 5. Heart Attack & Chest Pain
  if (text.includes('heart') || text.includes('cardio') || text.includes('cardiac') || text.includes('vascular')) {
    return 'Cardiac Cath Lab · 24/7 Active';
  }

  // 6. Pregnancy, Labour & Delivery
  if (text.includes('maternity') || text.includes('women') || text.includes('gynec') || text.includes('birth') || text.includes('cloudnine') || text.includes('motherhood')) {
    return 'Labour & Delivery · 24/7 On Duty';
  }

  // 7. Asthma, Breathing & Chest
  if (text.includes('lung') || text.includes('pulmo') || text.includes('chest') || text.includes('breath') || text.includes('asthma')) {
    return 'Asthma & Breathlessness · Oxygen Ready';
  }

  // 8. Brain Stroke & Neurological
  if (text.includes('neuro') || text.includes('brain') || text.includes('stroke') || text.includes('nimhans')) {
    return 'Brain Stroke Care · 24/7 CT Scan';
  }

  // 9. Stomach Pain, Vomiting & Food Poisoning
  if (text.includes('gastro') || text.includes('stomach') || text.includes('digest') || text.includes('liver') || text.includes('aig')) {
    return 'Severe Stomach Pain · Ultrasound Ready';
  }

  // 10. Kidney, Urology & Stones
  if (text.includes('uro') || text.includes('kidney') || text.includes('nephro') || text.includes('stone') || text.includes('dialysis')) {
    return 'Kidney Stone & Acute Care · 24/7';
  }

  // 11. Snake Bite & Poisoning
  if (text.includes('snake') || text.includes('venom')) {
    return 'Anti-Venom · Available 24/7';
  }
  if (text.includes('poison') || text.includes('toxic')) {
    return 'Poison & Toxicology · ICU Ready';
  }

  // 12. Apollo / Major Trauma Centers
  if (text.includes('apollo')) {
    return 'Accident & Trauma · 0 Min Wait';
  }

  // 13. High Fever & General In-Clinic
  if (text.includes('fortis') || text.includes('clinic') || text.includes('primary')) {
    return 'High Fever Care · Doctor on Duty';
  }

  // Default Real-Life Panic / Emergency Assurance:
  return 'High Fever & Emergency Care · 24/7';
}

interface Props {
  id?: string;
  name?: string;
  image?: string;
  location?: string;
  distance?: string;
  speciality?: string;
  rating?: string;
  departments?: string;
  logo?: string | any;
  fee?: string;
  nextAvailable?: string;
  offer?: string;
  heroBadge?: string;
  category?: string;
}

export default function HospitalDetailCard({
  id = 'hosp-1',
  name = "Hitas Super Speciality Hospital",
  image = "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2073&auto=format&fit=crop",
  location = "Banjara Hills, Hyderabad",
  distance = "< 2.5 km",
  speciality = "Multi Speciality Hospital",
  rating = "4.6",
  departments = "Cardiology • Neurology • +12 more",
  logo = "https://cdn-icons-png.flaticon.com/512/2966/2966327.png",
  fee = "₹1500 onwards",
  nextAvailable = "Today, 02:00 PM",
  offer,
  heroBadge,
  category,
}: Props) {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [isFavorited, setIsFavorited] = React.useState(false);
  const cardRadius = 14;

  const displayOffer = offer ?? React.useMemo(() => {
    const offersMap: Record<string, string> = {
      'hosp-1': '50% off upto ₹150',
      'hosp-2': 'Flat ₹140 OFF above ₹199',
      'hosp-3': '60% off upto ₹200',
      'hosp-4': 'Flat ₹175 OFF above ₹449',
      'hosp-5': '30% off upto ₹100',
      'hosp-6': 'Flat ₹150 OFF on Consult',
      'hosp-7': '40% off upto ₹250',
      'hosp-8': 'Flat ₹120 OFF',
    };
    return offersMap[id] || '50% off upto ₹150';
  }, [id, offer]);

  const departmentData = React.useMemo(() => {
    return parseDepartmentIcons(departments, speciality);
  }, [departments, speciality]);

  const heroBadgeText = React.useMemo(() => {
    return getRealLifeHeroBadge({
      heroBadge,
      name,
      departments,
      speciality,
      category,
    });
  }, [heroBadge, name, departments, speciality, category]);

  return (
    <TouchableOpacity 
      activeOpacity={0.92} 
      style={[
        styles.outerContainer,
        {
          backgroundColor: isDark ? '#1C1E24' : '#FFFFFF',
          borderRadius: cardRadius,
          shadowColor: isDark ? '#000000' : '#0F172A',
          shadowOpacity: isDark ? 0.45 : 0.12,
          shadowOffset: { width: 0, height: 6 },
          shadowRadius: 14,
          elevation: 6,
        }
      ]}
      onPress={() => router.push(`/hospital/${id}`)}
    >
      <View style={[
        styles.cardContainer, 
        { 
          backgroundColor: isDark ? '#1C1E24' : '#FFFFFF', 
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
          borderRadius: cardRadius,
        }
      ]}>
        
        {/* Top Image Section */}
        <View style={[styles.imageSection, { borderTopLeftRadius: cardRadius - 1, borderTopRightRadius: cardRadius - 1 }]}>
          <Image 
            source={resolveImageSource(image)} 
            style={[styles.mainImage, { borderTopLeftRadius: cardRadius - 1, borderTopRightRadius: cardRadius - 1 }]}
            resizeMode="cover"
          />

          {/* Top Left Floating Minimal Hero Badge (Real-Life Scenario) */}
          {heroBadgeText ? (
            <View style={styles.topLeftHeroBadge}>
              <LinearGradient
                colors={['rgba(15, 23, 42, 0.90)', 'rgba(30, 41, 59, 0.84)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroBadgeGradient}
              >
                <Text style={styles.heroBadgeText} numberOfLines={1}>
                  {heroBadgeText}
                </Text>
              </LinearGradient>
            </View>
          ) : null}

          {/* Controlled Bottom Gradient for Offer Overlay */}
          {displayOffer ? (
            <LinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 0.42)', 'rgba(0, 0, 0, 0.85)']}
              locations={[0, 0.52, 1]}
              style={styles.imageBottomGradient}
            >
              <View style={styles.offerOverlayRow}>
                <OfferBadgeIcon size={16} color="#FF5200" percentColor="#FFFFFF" />
                <Text style={styles.offerOverlayText} numberOfLines={1}>
                  {displayOffer}
                </Text>
              </View>
            </LinearGradient>
          ) : null}

          {/* Top Right Heart (Love Symbol) */}
          <TouchableOpacity 
            style={styles.topRightBookmark}
            activeOpacity={0.8}
            onPress={(e) => {
              e.stopPropagation();
              setIsFavorited(!isFavorited);
            }}
          >
            <Heart 
              size={20} 
              color={isFavorited ? "#EF4444" : "#FFFFFF"} 
              fill={isFavorited ? "#EF4444" : "rgba(0,0,0,0.25)"} 
              strokeWidth={2} 
            />
          </TouchableOpacity>
        </View>

        {/* Bottom Content Section */}
        <View style={[styles.bottomSection, { backgroundColor: isDark ? '#1C1E24' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }]}>
          {/* Header Row: Title and Rating */}
          <View style={styles.headerRow}>
            {logo && <Image source={resolveImageSource(logo)} style={{ width: 22, height: 22, marginRight: 8, borderRadius: 4 }} resizeMode="contain" />}
            <Text style={[styles.hospitalName, { color: isDark ? '#FFFFFF' : '#1C1C1E' }]} numberOfLines={1}>{name}</Text>
            <View style={styles.ratingRow}>
              <Star size={13} color="#F59E0B" fill="#F59E0B" />
              <Text style={[styles.ratingText, { color: isDark ? '#F3F4F6' : '#374151' }]}>{rating}</Text>
            </View>
          </View>

          {/* Info Rows */}
          <View style={styles.infoRowContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.subTextLeft} numberOfLines={1}>{location}</Text>
              <Text style={styles.subTextRight}>{distance}</Text>
            </View>
            <View style={styles.horizontalDivider} />
            <View style={styles.phcInfoRow}>
              <View style={[styles.phcInfoBlock, { alignItems: 'flex-start' }]}>
                <Text style={styles.phcInfoLabel} numberOfLines={1} adjustsFontSizeToFit>Consultation</Text>
                <Text style={[styles.phcInfoValue, { color: isDark ? '#F3F4F6' : '#1C1C1E' }]} numberOfLines={1} adjustsFontSizeToFit>{fee}</Text>
              </View>
              
              <View style={styles.verticalDivider} />
              
              <View style={[styles.phcInfoBlock, { alignItems: 'center' }]}>
                <Text style={styles.phcInfoLabel} numberOfLines={1} adjustsFontSizeToFit>Timings</Text>
                <Text style={[styles.phcInfoValue, { color: isDark ? '#F3F4F6' : '#1C1C1E' }]} numberOfLines={1} adjustsFontSizeToFit>{nextAvailable}</Text>
              </View>
              
              <View style={styles.verticalDivider} />
              
              <View style={[styles.phcInfoBlock, { alignItems: 'flex-end' }]}>
                <Text style={styles.phcInfoLabel} numberOfLines={1} adjustsFontSizeToFit>Departments</Text>
                <View style={[styles.phcAvatars, { marginTop: 2 }]}>
                  {departmentData.icons.map((item, idx) => (
                    <View
                      key={`dept-${item.label}-${idx}`}
                      style={[
                        styles.phcAvatarImg,
                        {
                          marginLeft: idx === 0 ? 0 : -6,
                          backgroundColor: isDark ? item.bgDark : item.bgLight,
                          borderColor: isDark ? '#1C1E24' : '#FFFFFF',
                          zIndex: 10 - idx,
                        },
                      ]}
                    >
                      <Image
                        source={item.icon}
                        style={styles.deptIconImg}
                        resizeMode="cover"
                      />
                    </View>
                  ))}
                  {departmentData.extraCountBadge ? (
                    <View
                      style={[
                        styles.phcAvatarImg,
                        styles.phcAvatarCount,
                        {
                          marginLeft: -6,
                          borderColor: isDark ? '#1C1E24' : '#FFFFFF',
                          backgroundColor: isDark ? '#2A2E39' : '#F1F5F9',
                          zIndex: 1,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.phcAvatarCountText,
                          { color: isDark ? '#D1D5DB' : '#374151' },
                        ]}
                      >
                        {departmentData.extraCountBadge}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    marginVertical: 9,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 14,
      },
      android: {
        elevation: 6,
        shadowColor: '#000000',
      },
      web: {
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.10)',
      },
    }),
  },
  cardContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  imageSection: {
    width: '100%',
    height: 215,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
  },
  topRightBookmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  topLeftHeroBadge: {
    position: 'absolute',
    top: 11,
    left: 11,
    borderRadius: 20,
    zIndex: 10,
    maxWidth: '78%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 4,
  },
  heroBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingTop: 4,
    paddingBottom: 4.5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  heroBadgeText: {
    fontFamily: Fonts.semiBold,
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.15,
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: 14,
  },
  imageBottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: 9,
    zIndex: 8,
  },
  offerOverlayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  offerOverlayText: {
    fontFamily: Fonts.bold,
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.55)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bottomSection: {
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 14,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  hospitalName: {
    fontFamily: Fonts.bold,
    flex: 1,
    fontSize: 16.5,
    fontWeight: '700',
    color: '#1C1C1E',
    letterSpacing: -0.15,
    marginRight: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  ratingText: {
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  infoRowContainer: {
    gap: 0,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subTextLeft: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#6B7280',
    flexShrink: 1,
  },
  subTextRight: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#10B981',
  },
  phcAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phcAvatarImg: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  deptIconImg: {
    width: '100%',
    height: '100%',
    borderRadius: 11,
  },
  phcAvatarCount: {
    backgroundColor: '#F5F5F5',
  },
  phcAvatarCountText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#333',
  },
  phcInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 0,
    gap: 0,
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    width: '100%',
    marginVertical: 7,
  },
  verticalDivider: {
    width: 1,
    height: 26,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  phcInfoBlock: {
    flex: 1,
  },
  phcInfoIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phcInfoLabel: {
    fontSize: 9.5,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 2,
  },
  phcInfoValue: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1C1C1E',
  }
});
