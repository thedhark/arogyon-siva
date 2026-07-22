import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, Heart, Star, ShieldPlus } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ArogyanPlusBanner() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#103F35', '#0A2B24']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Abstract Background Orbs */}
        <View style={styles.orb1} />
        <View style={styles.orb2} />
        
        {/* Content */}
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Crown size={22} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.title}>Arogyan Plus</Text>
          </View>
          
          <Text style={styles.description}>
            Unlock exclusive benefits and{'\n'}personalized care.
          </Text>
          
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Explore Benefits</Text>
          </TouchableOpacity>
        </View>

        {/* Floating Icons */}
        <View style={styles.floatingIconsContainer}>
          {/* Connector lines (abstract) */}
          <View style={styles.line1} />
          <View style={styles.line2} />

          {/* Floating Icon 1 */}
          <View style={[styles.iconCircle, { top: 20, right: 30, width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Star size={20} color="#FFFFFF" fill="#FFFFFF" />
          </View>

          {/* Floating Icon 2 */}
          <View style={[styles.iconCircle, { top: 70, right: 80, width: 56, height: 56, backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Heart size={24} color="#FFFFFF" />
          </View>

          {/* Floating Icon 3 */}
          <View style={[styles.iconCircle, { top: 75, right: 10, width: 48, height: 48, backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <ShieldPlus size={22} color="#FFFFFF" />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  gradient: {
    width: '100%',
    position: 'relative',
  },
  orb1: {
    position: 'absolute',
    right: -40,
    top: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  orb2: {
    position: 'absolute',
    right: 40,
    bottom: -60,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  content: {
    padding: 24,
    zIndex: 2,
    width: '70%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 22,
    marginBottom: 20,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#EEFBF4', // Very light green
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#106B52', // Dark green matching the banner theme
    fontWeight: '700',
    fontSize: 14,
  },
  floatingIconsContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 160,
    zIndex: 1,
  },
  iconCircle: {
    position: 'absolute',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  line1: {
    position: 'absolute',
    top: 40,
    right: 65,
    width: 30,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: [{ rotate: '45deg' }],
  },
  line2: {
    position: 'absolute',
    top: 90,
    right: 50,
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: [{ rotate: '-15deg' }],
  }
});
