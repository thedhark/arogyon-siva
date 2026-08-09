import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Sparkles, Shield, HeartHandshake, Stethoscope, UserCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

interface ExpertCareModuleProps {
  colors: any;
  isDark: boolean;
  onSpecialityPress?: (speciality: string) => void;
}

export type ExpertBanner = {
  id: string;
  badge: string;
  titlePrimary: string;
  titleSecondary: string;
  subtitle: string;
  ctaText: string;
  accent: string;
  image: number;
  icon: any;
  actionType: 'surgery' | 'international' | 'preventive' | 'women' | 'men';
};

const EXPERT_BANNERS: ExpertBanner[] = [
  {
    id: 'banner-surgery',
    badge: 'SENIOR SURGEONS',
    titlePrimary: 'Planned Surgery',
    titleSecondary: '& CLINICAL CARE',
    subtitle: 'Consult top surgical specialists with 24/7 post-care assistance.',
    ctaText: 'Consult Expert',
    accent: '#3B82F6',
    image: require('../assets/images/expert-module/planned-surgery.png'),
    icon: Stethoscope,
    actionType: 'surgery',
  },
  {
    id: 'banner-international',
    badge: 'GLOBAL OPINION',
    titlePrimary: 'International',
    titleSecondary: 'PATIENT CARE',
    subtitle: 'World-class medical tourism, tele-consults & multi-disciplinary care.',
    ctaText: 'Get Medical Opinion',
    accent: '#6366F1',
    image: require('../assets/images/expert-module/international-patient-care.png'),
    icon: HeartHandshake,
    actionType: 'international',
  },
  {
    id: 'banner-preventive',
    badge: 'FULL BODY CARE',
    titlePrimary: 'Preventive Health',
    titleSecondary: '& WELLNESS',
    subtitle: 'Proactive diagnostic checkups paired with 1:1 expert guidance.',
    ctaText: 'View Care Plans',
    accent: '#10B981',
    image: require('../assets/images/expert-module/preventive-care.png'),
    icon: Shield,
    actionType: 'preventive',
  },
  {
    id: 'banner-women',
    badge: 'TOP GYNECOLOGISTS',
    titlePrimary: "Women's Health",
    titleSecondary: '& MATERNITY CARE',
    subtitle: 'Dedicated gynecologists, fertility experts & 40-week maternity plans.',
    ctaText: 'Explore Experts',
    accent: '#EC4899',
    image: require('../assets/images/expert-module/womens-health.png'),
    icon: Sparkles,
    actionType: 'women',
  },
  {
    id: 'banner-men',
    badge: 'EXECUTIVE WELLNESS',
    titlePrimary: "Men's Health",
    titleSecondary: '& FITNESS CARE',
    subtitle: 'Specialized prostate, hormonal, heart & lifestyle consultations.',
    ctaText: 'Consult Specialist',
    accent: '#8B5CF6',
    image: require('../assets/images/expert-module/planned-surgery.png'),
    icon: UserCheck,
    actionType: 'men',
  },
];

export default function ExpertCareModule({ colors, isDark, onSpecialityPress }: ExpertCareModuleProps) {
  const router = useRouter();

  const handleBannerPress = (banner: ExpertBanner) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (banner.actionType === 'surgery') {
      router.push({ pathname: '/care/service/[id]', params: { id: 'post-surgery' } });
    } else if (banner.actionType === 'international') {
      router.push({ pathname: '/care/service/[id]', params: { id: 'international' } });
    } else if (banner.actionType === 'women') {
      router.push({ pathname: '/care/service/[id]', params: { id: 'women' } });
    } else if (banner.actionType === 'preventive') {
      router.push({ pathname: '/care/service/[id]', params: { id: 'preventive' } });
    } else if (banner.actionType === 'men') {
      router.push({ pathname: '/care/service/[id]', params: { id: 'men' } });
    } else {
      router.push('/search');
    }
  };

  return (
    <View style={styles.container}>
      {EXPERT_BANNERS.map((banner) => {
        const Icon = banner.icon;

        return (
          <TouchableOpacity
            key={banner.id}
            activeOpacity={0.92}
            onPress={() => handleBannerPress(banner)}
            style={[
              styles.bannerCard,
              {
                backgroundColor: isDark ? '#1E1E24' : '#FFFFFF',
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              },
            ]}
          >
            {/* Background Image - Full Bleed without any white spread */}
            <Image
              source={banner.image}
              style={styles.backgroundImage}
              contentFit="cover"
              transition={200}
            />

            {/* Banner Foreground Content */}
            <View style={styles.contentContainer}>
              {/* Header Tag Badge */}
              <View style={styles.badgeRow}>
                <View style={[styles.iconPill, { backgroundColor: banner.accent }]}>
                  <Icon size={12} color="#FFFFFF" />
                </View>
                <View style={styles.badgePill}>
                  <Text style={styles.badgeText}>{banner.badge}</Text>
                </View>
              </View>

              {/* Title & Subtitle */}
              <View style={styles.titleWrap}>
                <Text style={styles.titlePrimary}>{banner.titlePrimary}</Text>
                <Text style={[styles.titleSecondary, { color: banner.accent }]}>
                  {banner.titleSecondary}
                </Text>
                <Text style={styles.subtitleText} numberOfLines={2}>
                  {banner.subtitle}
                </Text>
              </View>

              {/* Action CTA Button */}
              <View style={styles.ctaRow}>
                <View style={[styles.ctaButton, { backgroundColor: banner.accent }]}>
                  <Text style={styles.ctaButtonText}>{banner.ctaText}</Text>
                  <ArrowRight size={14} color="#FFFFFF" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
    marginVertical: 8,
  },
  bannerCard: {
    width: '100%',
    height: 225,
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    width: '78%',
    zIndex: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconPill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  titleWrap: {
    gap: 3,
    marginVertical: 4,
  },
  titlePrimary: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: -0.4,
    textShadowColor: 'rgba(0, 0, 0, 0.65)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  titleSecondary: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.65)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitleText: {
    color: '#F8FAFC',
    fontSize: 12.5,
    fontWeight: '600',
    lineHeight: 17,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.65)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
});
