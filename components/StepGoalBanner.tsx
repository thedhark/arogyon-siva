import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Glasses, ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export default function StepGoalBanner() {
  const router = useRouter();
  const { isDark } = useTheme();

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      style={styles.container}
      onPress={() => {
        // Can navigate to a rewards or steps challenge screen
        router.push('/(tabs)/package' as any);
      }}
    >
      <View style={styles.bannerCard}>
        <LinearGradient
          colors={['#050505', '#161920', '#252936']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradientBg}
        />

        {/* Content Container */}
        <View style={styles.contentLeft}>
          {/* Brand Tag Row */}
          <View style={styles.brandRow}>
            <Glasses size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.brandText}>lenskart</Text>
            <View style={styles.badgePill}>
              <Flame size={10} color="#FF5436" fill="#FF5436" />
              <Text style={styles.badgeText}>FITNESS CHALLENGE</Text>
            </View>
          </View>

          {/* Main Title: RUN FOR FRAME */}
          <View style={styles.titleRow}>
            <Text style={styles.titleWhite}>RUN </Text>
            <Text style={styles.titleOrange}>FOR </Text>
            <Text style={styles.titleWhite}>FRAME</Text>
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            COMPLETE STEP GOALS {'\n'}
            <Text style={styles.subtitleBold}>& GET A FREE FRAME*</Text>
          </Text>

          <View style={styles.ctaRow}>
            <Text style={styles.ctaText}>Join Goal Challenge</Text>
            <ArrowRight size={14} color="#FF5436" />
          </View>
        </View>

        {/* Right Runner Visual */}
        <View style={styles.visualWrapper}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=800' }} 
            style={styles.runnerImage} 
            contentFit="cover" 
          />
          <LinearGradient
            colors={['#050505', 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 0.4, y: 0.5 }}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  bannerCard: {
    height: 148,
    borderRadius: 22,
    overflow: 'hidden',
    flexDirection: 'row',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
  },
  contentLeft: {
    flex: 1.2,
    justifyContent: 'center',
    paddingLeft: 18,
    paddingRight: 8,
    paddingVertical: 14,
    zIndex: 2,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginRight: 8,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 84, 54, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  badgeText: {
    color: '#FF5436',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleWhite: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  titleOrange: {
    color: '#FF5436',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 15,
    marginBottom: 8,
  },
  subtitleBold: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ctaText: {
    color: '#FF5436',
    fontSize: 11,
    fontWeight: '800',
  },
  visualWrapper: {
    flex: 0.8,
    height: '100%',
    position: 'relative',
  },
  runnerImage: {
    width: '100%',
    height: '100%',
  },
});
