import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { ArrowRight, Crown } from 'lucide-react-native';
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
  },
  {
    id: 'surgery',
    titlePrimary: 'Planned',
    titleSecondary: 'SURGERY',
    accent: '#155EEF',
    image: require('../assets/images/expert-module/planned-surgery.png'),
  },
  {
    id: 'women',
    titlePrimary: "Women's",
    titleSecondary: 'HEALTH',
    accent: '#F43F7F',
    image: require('../assets/images/expert-module/womens-health.png'),
  },
  {
    id: 'preventive',
    titlePrimary: 'Preventive',
    titleSecondary: 'CARE',
    accent: '#2F9E44',
    image: require('../assets/images/expert-module/preventive-care.png'),
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
      router.push({ pathname: '/packages/category/[id]', params: { id: 'fitness' } });
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
            <Image 
              source={card.image} 
              style={styles.featureImage} 
              contentFit="cover" 
              transition={200} 
            />

            <View style={styles.featureContent}>
              <View style={styles.featureCopy}>
                <Text style={[styles.titlePrimary, { color: colors.text }]}>{card.titlePrimary}</Text>
                <Text style={[styles.titleSecondary, { color: card.accent }]}>{card.titleSecondary}</Text>
                <View style={[styles.accentLine, { backgroundColor: card.accent }]} />
              </View>

              <View 
                style={[
                  styles.roundAction, 
                  { 
                    borderColor: card.accent, 
                    backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.75)',
                    marginTop: 'auto'
                  }
                ]}
              >
                <ArrowRight size={22} color={card.accent} strokeWidth={2.4} />
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
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
  },
  featureCopy: {
    width: '68%',
    minWidth: 170,
    gap: 6,
  },
  titlePrimary: {
    fontSize: 26,
    lineHeight: 30,
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
  compactGrid: {
    gap: 12,
  },
  compactGridWide: {
    flexDirection: 'row',
  },
  compactCard: {
    minHeight: 180,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
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
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
});
