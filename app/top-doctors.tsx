import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Sparkles, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { TRUSTED_DOCTORS } from '@/constants/trusted-doctors';
import TopDoctorGridCard from '@/components/offers/TopDoctorGridCard';
import FloatingCartBar from '@/components/booking/FloatingCartBar';
import { Fonts } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function TopDoctorsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <View style={[styles.screen, { backgroundColor: isDark ? '#121214' : '#F9FAFB' }]}>
      <StatusBar barStyle="light-content" />

      {/* Hero Header Banner */}
      <View style={[styles.heroContainer, { paddingTop: Math.max(insets.top, 16) }]}>
        <LinearGradient
          colors={['#881337', '#6B0B23', '#4C0519']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Ambient Decorative Shapes */}
        <View style={styles.ambientDecor1}>
          <Heart size={36} color="rgba(255, 255, 255, 0.08)" fill="rgba(255, 255, 255, 0.08)" />
        </View>
        <View style={styles.ambientDecor2}>
          <Heart size={28} color="rgba(255, 255, 255, 0.06)" fill="rgba(255, 255, 255, 0.06)" />
        </View>

        {/* Top Back Navigation Row */}
        <View style={styles.navRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleBack}
            style={styles.backBtn}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Banner Content: Left Title + Right 3D Gift Bag */}
        <View style={styles.heroContentRow}>
          <View style={styles.heroTextContainer}>
            <View style={styles.sparkleRow}>
              <Sparkles size={14} color="#FDE047" />
              <Sparkles size={10} color="#FDE047" style={{ marginLeft: 30, marginTop: -6 }} />
            </View>
            <Text style={styles.heroTitleTop}>TOP DOCTORS</Text>
            <Text style={styles.heroTitleBottom}>FOR YOU</Text>
            <View style={styles.sparkleBottomRow}>
              <Sparkles size={11} color="#FDE047" />
            </View>
          </View>

          {/* 3D Gift Bag Illustration */}
          <View style={styles.giftBagWrapper}>
            <Image
              source={require('@/assets/images/top_doctors_gift_bag.jpg')}
              style={styles.giftBagImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      {/* Doctor Grid 2-Columns */}
      <FlatList
        data={TRUSTED_DOCTORS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 40).duration(280)}
            style={{ flex: 1 }}
          >
            <TopDoctorGridCard doctor={item} />
          </Animated.View>
        )}
      />

      <FloatingCartBar variant="home" bottomOffset={20} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  heroContainer: {
    position: 'relative',
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  ambientDecor1: {
    position: 'absolute',
    top: 50,
    right: 140,
  },
  ambientDecor2: {
    position: 'absolute',
    bottom: 20,
    left: 170,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  heroTextContainer: {
    flex: 1,
    paddingLeft: 4,
  },
  sparkleRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  sparkleBottomRow: {
    marginTop: 4,
    marginLeft: 110,
  },
  heroTitleTop: {
    color: '#FFFFFF',
    fontSize: 27,
    fontFamily: Fonts.bold,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -0.5,
    lineHeight: 31,
  },
  heroTitleBottom: {
    color: '#FFFFFF',
    fontSize: 27,
    fontFamily: Fonts.bold,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -0.5,
    lineHeight: 31,
  },
  giftBagWrapper: {
    width: 120,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  giftBagImage: {
    width: '100%',
    height: '100%',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingTop: 16,
    paddingBottom: 110,
  },
});
