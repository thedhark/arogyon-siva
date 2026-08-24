import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

interface Props {
  onBack?: () => void;
}

export default function KneeBanner({ onBack }: Props) {
  const router = useRouter();

  return (
    <View style={styles.bannerContainer}>
      <Image
        source={require('../../../assets/images/package-banners/bones_and_joints.png')}
        style={styles.bannerImage}
        contentFit="cover"
      />

      <SafeAreaView edges={['top']} style={styles.headerBar}>
        <TouchableOpacity onPress={onBack || (() => router.back())} style={styles.backBtn}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
      </SafeAreaView>

      <View style={styles.offerBox}>
        <Text style={styles.offerHighlight}>FLAT ₹5,000 OFF SURGERY & REHAB</Text>
        <Text style={styles.offerSubtitle}>Robotic Knee Surgery & ACL Recovery Plans</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
    position: 'relative',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 20,
  },
  offerBox: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  offerHighlight: {
    fontSize: 20,
    fontWeight: '900',
    color: '#84E034',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  offerSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
});
