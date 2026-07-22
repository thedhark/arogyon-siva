import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Activity,
  ArrowRight,
  Baby,
  Building2,
  ClipboardCheck,
  Crown,
  Flower2,
  Headphones,
  HeartPulse,
  Leaf,
  Plane,
  ShieldCheck,
  Stethoscope,
  Syringe,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

type IconComponent = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

type FeatureCard = {
  id: 'international' | 'surgery' | 'women' | 'preventive';
  titlePrimary: string;
  titleSecondary: string;
  accent: string;
  image: number;
  items: { label: string; icon: IconComponent }[];
};

type CompactCard = {
  id: 'membership';
  titlePrimary: string;
  titleSecondary: string;
  accent: string;
  image: number;
  icon: IconComponent;
};

interface ExpertCareModuleProps {
  colors: any;
  isDark: boolean;
  onSpecialityPress?: (speciality: string) => void;
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    id: 'international',
    titlePrimary: 'International',
    titleSecondary: 'PATIENT CARE',
    accent: '#155EEF',
    image: require('../assets/images/expert-module/international-patient-care.png'),
    items: [
      { label: 'Visa Support', icon: ClipboardCheck },
      { label: 'Travel Assistance', icon: Plane },
      { label: 'Language Support', icon: Headphones },
      { label: 'Hospital Coordination', icon: Building2 },
    ],
  },
  {
    id: 'surgery',
    titlePrimary: 'Planned',
    titleSecondary: 'SURGERY',
    accent: '#155EEF',
    image: require('../assets/images/expert-module/planned-surgery.png'),
    items: [
      { label: 'Consultation', icon: Stethoscope },
      { label: 'Surgery Planning', icon: Syringe },
      { label: 'Trusted Hospitals', icon: ShieldCheck },
      { label: 'Recovery Support', icon: HeartPulse },
    ],
  },
  {
    id: 'women',
    titlePrimary: "Women's",
    titleSecondary: 'HEALTH',
    accent: '#F43F7F',
    image: require('../assets/images/expert-module/womens-health.png'),
    items: [
      { label: 'Gynaecologists', icon: Stethoscope },
      { label: 'Maternity Care', icon: Baby },
      { label: 'PCOS & Wellness', icon: Flower2 },
      { label: 'Hormone Check', icon: Syringe },
    ],
  },
  {
    id: 'preventive',
    titlePrimary: 'Preventive',
    titleSecondary: 'CARE',
    accent: '#2F9E44',
    image: require('../assets/images/expert-module/preventive-care.png'),
    items: [
      { label: 'Full Body Check', icon: ClipboardCheck },
      { label: 'Lab Screening', icon: Activity },
      { label: 'Doctor Review', icon: Stethoscope },
      { label: 'Health Score', icon: HeartPulse },
    ],
  },
];

const COMPACT_CARDS: CompactCard[] = [
  {
    id: 'membership',
    titlePrimary: 'Arogyon',
    titleSecondary: 'MEMBERSHIP',
    accent: '#F59F00',
    image: require('../assets/images/expert-module/membership.png'),
    icon: Crown,
  },
];

export default function ExpertCareModule({ colors, isDark, onSpecialityPress }: ExpertCareModuleProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 760;

  const openFeatureCard = (id: FeatureCard['id']) => {
    if (id === 'surgery') {
      router.push({ pathname: '/care/service/[id]', params: { id: 'post-surgery' } });
      return;
    }

    if (id === 'women') {
      onSpecialityPress?.('Gynaecologist');
      return;
    }

    if (id === 'preventive') {
      router.push({ pathname: '/packages/category/[categoryId]', params: { categoryId: 'fitness' } });
      return;
    }

    router.push('/search');
  };

  const openCompactCard = (id: CompactCard['id']) => {
    router.push('/profile');
  };

  return (
    <View style={styles.module}>
      <View style={[styles.featureGrid, isWide && styles.featureGridWide]}>
        {FEATURE_CARDS.map((card) => (
          <TouchableOpacity
            key={card.id}
            activeOpacity={0.9}
            onPress={() => openFeatureCard(card.id)}
            style={[
              styles.featureCard,
              isWide && styles.featureCardWide,
              {
                backgroundColor: isDark ? '#16181D' : '#FFFFFF',
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6',
              },
            ]}
          >
            <Image source={card.image} style={styles.featureImage} contentFit="cover" transition={200} />

            <View style={styles.featureContent}>
              <View style={styles.featureCopy}>
                <Text style={[styles.titlePrimary, { color: colors.text }]}>{card.titlePrimary}</Text>
                <Text style={[styles.titleSecondary, { color: card.accent }]}>{card.titleSecondary}</Text>
                <View style={[styles.accentLine, { backgroundColor: card.accent }]} />
              </View>

              <View style={styles.featureBenefits}>
                {card.items.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <View key={item.label} style={styles.benefitCell}>
                      {index > 0 && <View style={styles.benefitDivider} />}
                      <View style={[styles.benefitIcon, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.7)' }]}>
                        <Icon size={22} color={card.accent} strokeWidth={2.2} />
                      </View>
                      <Text style={[styles.benefitLabel, { color: isDark ? '#D7DAE3' : '#21314D' }]}>{item.label}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {COMPACT_CARDS.length > 0 && (
        <View style={[styles.compactGrid, isWide && styles.compactGridWide]}>
          {COMPACT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <TouchableOpacity
                key={card.id}
                activeOpacity={0.9}
                onPress={() => openCompactCard(card.id)}
                style={[
                  styles.compactCard,
                  isWide && styles.compactCardWide,
                  {
                    backgroundColor: isDark ? '#16181D' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6',
                  },
                ]}
              >
                <Image source={card.image} style={styles.compactImage} contentFit="cover" transition={200} />

                <View style={styles.compactContent}>
                  <View style={[styles.compactIcon, { borderColor: card.accent, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)' }]}>
                    <Icon size={24} color={card.accent} strokeWidth={2.1} />
                  </View>
                  <View style={styles.compactTitleWrap}>
                    <Text style={[styles.compactTitlePrimary, { color: colors.text }]}>{card.titlePrimary}</Text>
                    <Text style={[styles.compactTitleSecondary, { color: card.accent }]}>{card.titleSecondary}</Text>
                  </View>
                  <View style={[styles.compactAccentLine, { backgroundColor: card.accent }]} />
                  <View style={[styles.roundAction, { borderColor: card.accent, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)' }]}>
                    <ArrowRight size={22} color={card.accent} strokeWidth={2.4} />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  module: {
    gap: 12,
    marginBottom: 20,
  },
  featureGrid: {
    gap: 12,
  },
  featureGridWide: {
    flexDirection: 'row',
  },
  featureCard: {
    minHeight: 322,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  featureCardWide: {
    flex: 1,
  },
  featureImage: {
    ...StyleSheet.absoluteFillObject,
  },
  featureContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 22,
    gap: 18,
  },
  featureCopy: {
    width: '65%',
    minWidth: 180,
    gap: 10,
  },
  titlePrimary: {
    fontSize: 27,
    lineHeight: 31,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  titleSecondary: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  accentLine: {
    width: 38,
    height: 3,
    borderRadius: 99,
    marginTop: 4,
  },

  featureBenefits: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 86,
    paddingTop: 4,
  },
  benefitCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  benefitDivider: {
    position: 'absolute',
    left: 0,
    bottom: 3,
    width: StyleSheet.hairlineWidth,
    height: 58,
    backgroundColor: 'rgba(100, 116, 139, 0.18)',
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.74)',
    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',
  },
  benefitLabel: {
    minHeight: 34,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
  },
  compactGrid: {
    gap: 12,
  },
  compactGridWide: {
    flexDirection: 'row',
  },
  compactCard: {
    minHeight: 208,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  compactCardWide: {
    flex: 1,
  },
  compactImage: {
    ...StyleSheet.absoluteFillObject,
  },
  compactContent: {
    flex: 1,
    width: '68%',
    minWidth: 170,
    padding: 20,
    gap: 10,
  },
  compactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.58)',
  },
  compactTitleWrap: {
    gap: 2,
  },
  compactTitlePrimary: {
    fontSize: 22,
    lineHeight: 25,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  compactTitleSecondary: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  compactAccentLine: {
    width: 32,
    height: 2.5,
    borderRadius: 99,
  },
  roundAction: {
    marginTop: 'auto',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.56)',
  },
});
