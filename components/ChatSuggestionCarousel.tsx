import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import Animated, { SharedValue, useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Defs, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';
import { ChevronDown } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import WeightWellnessCard from './cards/WeightWellnessCard';

const THEME_COLORS = ['#9DC08B', '#E57C73', '#F0A500'];

interface Props {
  chatModeProgress: SharedValue<number>;
  onSuggestionPress: (text: string) => void;
  style?: any;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = SCREEN_WIDTH * 0.86; // Increased by 20%
const ITEM_HEIGHT = ITEM_WIDTH; // Perfect square
const SPACING = 16;
const SNAP_SIZE = ITEM_WIDTH + SPACING;
const SPACER_WIDTH = (SCREEN_WIDTH - ITEM_WIDTH) / 2;

const AnimatedWrapper = ({ index, scrollX, children }: any) => {
  const animatedStyle = useAnimatedStyle(() => {
    const position = index * SNAP_SIZE;
    const dist = scrollX.value - position;

    const scale = interpolate(
      dist,
      [-SNAP_SIZE, 0, SNAP_SIZE],
      [0.85, 1, 0.85],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      dist,
      [-SNAP_SIZE, 0, SNAP_SIZE],
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View style={[animatedStyle, { marginRight: index === 4 ? 0 : SPACING }]}>
      {children}
    </Animated.View>
  );
};

const Indicator = ({ index, scrollX, isDark }: { index: number, scrollX: SharedValue<number>, isDark: boolean }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const position = index * SNAP_SIZE;
    const dist = (scrollX.value - position) / SNAP_SIZE;
    const absDist = Math.abs(dist);

    const width = interpolate(
      absDist,
      [0, 1, 2, 3],
      [16, 6, 4, 0],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      absDist,
      [0, 1, 2, 3],
      [1, 0.4, 0.15, 0],
      Extrapolation.CLAMP
    );

    const marginHorizontal = interpolate(
      absDist,
      [2, 3],
      [3, 0],
      Extrapolation.CLAMP
    );

    return {
      width,
      opacity,
      marginHorizontal,
    };
  });

  return (
    <Animated.View style={[
      { height: 4, borderRadius: 2, backgroundColor: isDark ? '#FFFFFF' : '#000000' },
      animatedStyle
    ]} />
  );
};

export function ChatSuggestionCarousel({ chatModeProgress, onSuggestionPress, style }: Props) {
  const { isDark } = useTheme();
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <Animated.View style={[styles.container, style]}>
      <View style={styles.carouselWrapper}>
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={SNAP_SIZE}
          decelerationRate="fast"
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          style={{ overflow: 'visible' }}
          contentContainerStyle={{
            paddingHorizontal: SPACER_WIDTH,
            alignItems: 'center',
          }}
        >
          <AnimatedWrapper index={0} scrollX={scrollX}>
            <View style={[styles.cardContainer, { shadowColor: '#4AA64A' }]}>
              <WeightWellnessCard style={{ width: '100%', height: '100%' }} themeColor="#4AA64A" />
            </View>
          </AnimatedWrapper>
          <AnimatedWrapper index={1} scrollX={scrollX}>
            <View style={[styles.cardContainer, { shadowColor: THEME_COLORS[0] }]}>
              <WeightWellnessCard 
                style={{ width: '100%', height: '100%' }}
                themeColor={THEME_COLORS[0]}
                backgroundImage={require('../assets/images/cards/card1.jpg')}
                title="Hydration"
                weight="2.4"
                weightUnit="L"
                statusText="Keep drinking"
                chatMessage="You're doing great! 💧"
                vsLastWeek={0.5}
                goalProgress={60}
                streakDays={3}
              />
            </View>
          </AnimatedWrapper>
          <AnimatedWrapper index={2} scrollX={scrollX}>
            <View style={[styles.cardContainer, { shadowColor: THEME_COLORS[1] }]}>
              <WeightWellnessCard 
                style={{ width: '100%', height: '100%' }}
                themeColor={THEME_COLORS[1]}
                backgroundImage={require('../assets/images/cards/card2.jpg')}
                title="Sleep Quality"
                weight="7.5"
                weightUnit="hrs"
                statusText="Well rested"
                chatMessage="Perfect sleep! 😴"
                vsLastWeek={1.2}
                goalProgress={90}
                streakDays={7}
              />
            </View>
          </AnimatedWrapper>
          <AnimatedWrapper index={3} scrollX={scrollX}>
            <View style={[styles.cardContainer, { shadowColor: THEME_COLORS[2] }]}>
              <WeightWellnessCard 
                style={{ width: '100%', height: '100%' }}
                themeColor={THEME_COLORS[2]}
                backgroundImage={require('../assets/images/cards/card3.jpg')}
                title="Daily Steps"
                weight="8.2"
                weightUnit="k"
                statusText="Active"
                chatMessage="Keep moving! 🏃‍♂️"
                vsLastWeek={0.8}
                goalProgress={82}
                streakDays={5}
              />
            </View>
          </AnimatedWrapper>
          <AnimatedWrapper index={4} scrollX={scrollX}>
            <View style={[styles.cardContainer, { shadowColor: '#9F7AEA' }]}>
              <WeightWellnessCard 
                style={{ width: '100%', height: '100%' }}
                themeColor="#9F7AEA"
                backgroundImage={require('../assets/images/cards/diabetic_bg.jpg')}
                imageOffsetY="-45%"
                title="Blood Sugar"
                weight="105"
                weightUnit="mg/dL"
                statusText="In Range"
                vsLastWeek={-5}
                goalProgress={85}
                streakDays={14}
              />
            </View>
          </AnimatedWrapper>

        </Animated.ScrollView>
      </View>

      <View style={styles.paginationContainer}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Indicator key={i} index={i} scrollX={scrollX} isDark={isDark} />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginTop: 10,
    marginHorizontal: -12, 
  },
  carouselWrapper: {
    height: ITEM_HEIGHT + 60, // Add extra vertical space so large shadows don't get clipped
    width: '100%',
    justifyContent: 'center',
  },
  cardContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible', // Changed to visible so shadow applies correctly on the wrapper
    borderRadius: 20,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.6, // Increased opacity for colored shadows
    shadowRadius: 24,
    elevation: 12,
  },
  premiumCard: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 20,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  cardTopGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  cardContent: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  graphicContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  fakeInput: {
    width: '100%',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  fakeInputText: {
    fontSize: 14,
  },
  actionButton: {
    width: '100%',
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  accordionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
    marginTop: 'auto',
  },
  accordionText: {
    fontSize: 12,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    height: 12,
  }
});
