import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform, 
  ScrollView, 
  Dimensions, 
  useWindowDimensions,
  NativeSyntheticEvent, 
  NativeScrollEvent 
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';

export default function SpotlightBanner() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const [activeSlide, setActiveSlide] = useState(0);
  const [containerWidth, setContainerWidth] = useState(
    Platform.OS === 'web' ? Math.min(windowWidth, 430) : Dimensions.get('window').width
  );
  const scrollRef = useRef<ScrollView>(null);

  const handleConsultationsPress = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
    router.push('/offers/consultations' as any);
  };

  const handlePackagesPress = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
    router.push('/offers/packages' as any);
  };

  const handleInternationalPress = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
    router.push('/packages/category/international' as any);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const slideW = containerWidth > 0 ? containerWidth : 1;
    const index = Math.round(offsetX / slideW);
    if (index !== activeSlide && (index === 0 || index === 1)) {
      setActiveSlide(index);
    }
  };

  return (
    <View
      style={[
        styles.outerShadowWrapper,
        {
          shadowOpacity: isDark ? 0.35 : 0.08,
        },
      ]}
    >
      <View
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          if (w > 0 && Math.abs(w - containerWidth) > 1) {
            setContainerWidth(w);
          }
        }}
        style={[
          styles.cardContainer,
          {
            backgroundColor: isDark ? '#151A26' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
          },
        ]}
      >
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          bounces={false}
          decelerationRate="fast"
          style={styles.slidesScrollView}
        >
          {/* Slide 1: 3D Doctor Balloon 70% OFF Offer + Action Cards */}
          <View style={[styles.slidePage, { width: containerWidth }]}>
            {/* Top Hero Section */}
            <TouchableOpacity
              activeOpacity={0.92}
              onPress={handleConsultationsPress}
              style={styles.heroWrapper}
            >
              <Image
                source={require('@/assets/images/spotlight_balloon_hero.jpg')}
                style={styles.heroImage}
                contentFit="cover"
              />
            </TouchableOpacity>

            {/* Bottom Split Action Cards Row */}
            <View style={styles.cardsRow}>
              {/* Left Card: Consultations (Vibrant Green) */}
              <TouchableOpacity
                activeOpacity={0.88}
                style={styles.cardTouch}
                onPress={handleConsultationsPress}
              >
                <LinearGradient
                  colors={['#22C55E', '#16A34A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientCard}
                >
                  {/* Left Circle Icon */}
                  <View style={styles.iconCircleWrapper}>
                    <Image
                      source={require('@/assets/images/spotlight_chair_icon.png')}
                      style={styles.cardIconImage}
                      contentFit="contain"
                    />
                  </View>

                  {/* Middle Text Column */}
                  <View style={styles.cardTextCol}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      Consultations
                    </Text>
                    <Text style={styles.cardSubtitle} numberOfLines={1}>
                      Talk to Top Doctors
                    </Text>
                  </View>

                  {/* Bottom/Right Action Arrow Button */}
                  <View style={styles.actionArrowBtn}>
                    <ArrowRight size={13.5} color="#16A34A" strokeWidth={3} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Right Card: Packages (Vibrant Coral / Pink) */}
              <TouchableOpacity
                activeOpacity={0.88}
                style={styles.cardTouch}
                onPress={handlePackagesPress}
              >
                <LinearGradient
                  colors={['#FB7185', '#F43F5E']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientCard}
                >
                  {/* Left Circle Icon */}
                  <View style={styles.iconCircleWrapper}>
                    <Image
                      source={require('@/assets/images/spotlight_packages_icon.png')}
                      style={styles.cardIconImage}
                      contentFit="contain"
                    />
                  </View>

                  {/* Middle Text Column */}
                  <View style={styles.cardTextCol}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      Packages
                    </Text>
                    <Text style={styles.cardSubtitle} numberOfLines={1}>
                      Health Plans & More
                    </Text>
                  </View>

                  {/* Bottom/Right Action Arrow Button */}
                  <View style={styles.actionArrowBtn}>
                    <ArrowRight size={13.5} color="#F43F5E" strokeWidth={3} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Slide 2: International Patients Care Banner */}
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={handleInternationalPress}
            style={[styles.slidePage, { width: containerWidth }]}
          >
            <View style={styles.internationalHeroWrapper}>
              <Image
                source={require('@/assets/images/spotlight_international_patients.png')}
                style={styles.internationalHeroImage}
                contentFit="cover"
              />
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* Floating Pagination Dots */}
        <View style={styles.paginationContainer} pointerEvents="none">
          <View
            style={[
              styles.paginationDot,
              activeSlide === 0
                ? styles.paginationDotActive
                : [styles.paginationDotInactive, { backgroundColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)' }],
            ]}
          />
          <View
            style={[
              styles.paginationDot,
              activeSlide === 1
                ? styles.paginationDotActive
                : [styles.paginationDotInactive, { backgroundColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)' }],
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerShadowWrapper: {
    width: '100%',
    paddingHorizontal: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 14,
    elevation: 3,
    backgroundColor: 'transparent',
  },
  cardContainer: {
    width: '100%',
    borderRadius: 0,
    overflow: 'hidden',
    borderWidth: 0,
    position: 'relative',
  },
  slidesScrollView: {
    width: '100%',
  },
  slidePage: {
    paddingBottom: 14,
  },
  heroWrapper: {
    width: '100%',
    aspectRatio: 1024 / 545,
    backgroundColor: '#F8FAF9',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: -30,
    width: '100%',
    zIndex: 10,
  },
  cardTouch: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    position: 'relative',
    height: 84,
  },
  iconCircleWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginRight: 10,
    backgroundColor: 'transparent',
  },
  cardIconImage: {
    width: '100%',
    height: '100%',
  },
  cardTextCol: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 24,
  },
  cardTitle: {
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
    lineHeight: 19,
  },
  cardSubtitle: {
    fontFamily: Fonts.medium,
    color: 'rgba(255, 255, 255, 0.94)',
    fontSize: 11.5,
    fontWeight: '500',
    marginTop: 2,
    lineHeight: 15,
  },
  actionArrowBtn: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 3,
  },
  internationalHeroWrapper: {
    width: '100%',
    aspectRatio: 1024 / 682,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  internationalHeroImage: {
    width: '100%',
    height: '100%',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 4,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    zIndex: 20,
  },
  paginationDot: {
    height: 5,
    borderRadius: 2.5,
  },
  paginationDotActive: {
    width: 18,
    backgroundColor: '#10B981',
  },
  paginationDotInactive: {
    width: 5,
  },
});
