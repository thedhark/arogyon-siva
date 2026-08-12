import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BentoCard, { BentoCardProps } from './BentoCard';
import { useRouter } from 'expo-router';

interface ExpertBentoGridProps {
  isDark?: boolean;
  title?: string;
  onSelectCategory?: (id: string) => void;
}

const BENTO_CARDS_DATA: BentoCardProps[] = [
  // Left Column Item 1 - Pregnancy
  {
    id: 'pregnancy',
    title: 'Pregnancy',
    subtitle: 'Planned delivery',
    badgeLabel: 'Safe Delivery',
    badgeBg: '#E8F5E9',
    badgeTextColor: '#2E7D32',
    badgeIconName: 'shield-check',
    aspectRatio: 1.55,
    imageUri: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=400',
    iconName: 'baby',
  },
  // Left Column Item 2 - Surgery
  {
    id: 'surgery',
    title: 'Surgery',
    subtitle: 'Seamless procedures',
    badgeLabel: '0% EMI Available',
    badgeBg: '#E3F2FD',
    badgeTextColor: '#1565C0',
    badgeIconName: 'heart-pulse',
    aspectRatio: 1.1,
    imageUri: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=400',
    iconName: 'activity',
  },
  // Right Column Item 1 - Intl Health
  {
    id: 'foreign',
    title: 'Intl. Health',
    subtitle: 'World-class treatments',
    badgeLabel: 'Global Experts',
    badgeBg: '#F3E5F5',
    badgeTextColor: '#6A1B9A',
    badgeIconName: 'activity',
    aspectRatio: 1.1,
    imageUri: 'https://images.unsplash.com/photo-1504439468489-c8920d786a2b?q=80&w=400',
    iconName: 'globe',
  },
  // Right Column Item 2 - Second Opinion
  {
    id: 'opinion',
    title: '2nd Opinion',
    subtitle: 'Expert review',
    badgeLabel: 'Free Consult',
    badgeBg: '#FFF8E1',
    badgeTextColor: '#F57F17',
    badgeIconName: 'stethoscope',
    aspectRatio: 1.55,
    imageUri: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=400',
    iconName: 'file-text',
  },
];

export default function ExpertBentoGrid({
  isDark = false,
  title = 'Care & Specialities',
  onSelectCategory,
}: ExpertBentoGridProps) {
  const router = useRouter();

  const handleCardPress = (id: string) => {
    if (onSelectCategory) {
      onSelectCategory(id);
      return;
    }

    if (id === 'pregnancy') {
      router.push({ pathname: '/care/service/[id]', params: { id: 'women' } });
    } else if (id === 'surgery') {
      router.push({ pathname: '/care/service/[id]', params: { id: 'post-surgery' } });
    } else if (id === 'foreign') {
      router.push({ pathname: '/care/service/[id]', params: { id: 'international' } });
    } else if (id === 'opinion') {
      router.push({ pathname: '/care/service/[id]', params: { id: 'second-opinion' } });
    }
  };

  const cardMap = React.useMemo(() => {
    const map: Record<string, BentoCardProps> = {};
    BENTO_CARDS_DATA.forEach((card) => {
      map[card.id] = card;
    });
    return map;
  }, []);

  return (
    <View style={styles.outerContainer}>
      {title ? (
        <View style={styles.headerContainer}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#1E293B' }]}>
            {title}
          </Text>
        </View>
      ) : null}

      <View style={styles.gridContainer}>
        {/* Left Column (Pregnancy + Surgery) */}
        <View style={styles.leftColumn}>
          <BentoCard
            {...cardMap.pregnancy}
            isDark={isDark}
            onPress={handleCardPress}
          />
          <BentoCard
            {...cardMap.surgery}
            isDark={isDark}
            onPress={handleCardPress}
          />
        </View>

        {/* Right Column (Intl Health + 2nd Opinion) */}
        <View style={styles.rightColumn}>
          <BentoCard
            {...cardMap.foreign}
            isDark={isDark}
            onPress={handleCardPress}
          />
          <BentoCard
            {...cardMap.opinion}
            isDark={isDark}
            onPress={handleCardPress}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    marginTop: 18,
  },
  headerContainer: {
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  gridContainer: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  leftColumn: {
    flex: 1,
    gap: 10,
  },
  rightColumn: {
    flex: 1,
    gap: 10,
  },
});
