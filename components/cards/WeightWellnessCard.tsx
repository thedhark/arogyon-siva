import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { MoreVertical, ArrowRight, Sparkles, TrendingUp, Target, Flame, Droplets, Moon, Footprints, Activity, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface WeightWellnessCardProps {
  title?: string;
  weight?: number | string;
  weightUnit?: string;
  statusText?: string;
  chatMessage?: string;
  vsLastWeek?: number | string;
  goalProgress?: number;
  streakDays?: number;
  wellnessScore?: number;
  backgroundImage?: any;
  imageOffsetY?: string | number;
  themeColor?: string;
  style?: any;
}

export default function WeightWellnessCard({
  title = "Weight Wellness",
  weight = "68.5",
  weightUnit = "kg",
  statusText = "On track",
  chatMessage = "Small progress, keep going 💚",
  vsLastWeek = -1.2,
  goalProgress = 82,
  streakDays = 5,
  wellnessScore = 92,
  backgroundImage = { uri: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop' },
  imageOffsetY,
  themeColor = 'transparent',
  style,
}: WeightWellnessCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {/* Background Image */}
      <ImageBackground 
        source={backgroundImage} 
        style={styles.imageBackground}
        imageStyle={imageOffsetY ? { 
          top: imageOffsetY as any, 
          height: typeof imageOffsetY === 'string' && imageOffsetY.includes('%') 
            ? `${100 + Math.abs(parseInt(imageOffsetY))}%` as any
            : '100%' 
        } : {}}
        resizeMode="cover"
      >
        {/* Glass Border Overlay to prevent shadow bleed */}
        <View 
          style={[StyleSheet.absoluteFill, {
            borderRadius: 20,
            borderWidth: 1.5,
            borderColor: 'rgba(255, 255, 255, 0.15)',
            borderTopColor: 'rgba(255, 255, 255, 0.4)',
            borderLeftColor: 'rgba(255, 255, 255, 0.3)',
            zIndex: 100,
          }]} 
          pointerEvents="none" 
        />
        {/* User-suggested Glassmorphism Blur */}
        <BlurView intensity={15} tint="light" style={StyleSheet.absoluteFill} />

        {/* Asymmetrical White Spread Overlay */}
        <View style={[StyleSheet.absoluteFill, { zIndex: 1 }]} pointerEvents="none">
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0)', 
              'rgba(255, 255, 255, 0)', 
              'rgba(255, 255, 255, 0)', 
              'rgba(255, 255, 255, 0)', 
              'rgba(255, 255, 255, 0.5)', 
              'rgba(255, 255, 255, 0.9)', 
              'rgba(255, 255, 255, 1)', 
            ]}
            locations={[0, 0.15, 0.35, 0.55, 0.75, 0.85, 1]}
            style={StyleSheet.absoluteFill}
          />
        </View>
        
        {/* Content */}
        <View style={styles.content}>
          {/* Top Section: Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {title === 'Hydration' && <Droplets size={14} color="#2c5f20" style={{ marginRight: 4, marginBottom: 6 }} />}
                {title === 'Sleep Quality' && <Moon size={14} color="#2c5f20" style={{ marginRight: 4, marginBottom: 6 }} />}
                {title === 'Daily Steps' && <Footprints size={14} color="#2c5f20" style={{ marginRight: 4, marginBottom: 6 }} />}
                {title === 'Blood Sugar' && <Activity size={14} color="#2c5f20" style={{ marginRight: 4, marginBottom: 6 }} />}
                {title === 'Weight Wellness' && <Heart size={14} color="#2c5f20" style={{ marginRight: 4, marginBottom: 6 }} />}
                <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>{title}</Text>
              </View>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>You are doing very great today</Text>
              </View>
            </View>
            <TouchableOpacity style={{ marginLeft: 8 }}>
              <MoreVertical size={20} color="#2c5f20" />
            </TouchableOpacity>
          </View>
          
          <View style={{ flex: 1 }} />
          
          {/* Middle Section: Main Weight */}
          <View style={styles.weightSection}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={styles.weightValue} numberOfLines={1} adjustsFontSizeToFit>{weight}</Text>
              <Text style={styles.weightUnit}>{weightUnit}</Text>
            </View>
            <Text style={styles.weightLabel}>Current Weight</Text>
          </View>
          
          {/* Bottom Section: Bubble and Stats */}
          <View style={styles.bottomSection}>
            

            
            {/* Stats Row */}
            <View style={styles.statsRow}>
              
              <View style={styles.statColumn}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={styles.statValue} numberOfLines={1}>{Number(vsLastWeek) > 0 ? `+${vsLastWeek}` : vsLastWeek}</Text>
                  <Text style={styles.statUnit}>{weightUnit}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                  <TrendingUp size={12} color="#718096" style={{ marginRight: 4 }} />
                  <Text style={[styles.statLabel, { marginTop: 0 }]} numberOfLines={1}>vs last week</Text>
                </View>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statColumn}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={styles.statValue} numberOfLines={1}>{goalProgress}</Text>
                  <Text style={styles.statUnit}>%</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                  <Target size={12} color="#718096" style={{ marginRight: 4 }} />
                  <Text style={[styles.statLabel, { marginTop: 0 }]} numberOfLines={1}>Goal progress</Text>
                </View>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statColumn}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={styles.statValue} numberOfLines={1}>{streakDays}</Text>
                  <Text style={styles.statUnit}>Days</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                  <Flame size={12} color="#E53E3E" style={{ marginRight: 4 }} />
                  <Text style={[styles.statLabel, { marginTop: 0 }]} numberOfLines={1}>Streak</Text>
                </View>
              </View>
              

            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    borderRadius: 20, // Adjusted to exactly match the 20px from original CSS
    overflow: 'hidden',
    backgroundColor: '#f4f6f1',
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 24,
    zIndex: 2,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2c5f20',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    backgroundColor: '#63a84e',
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    color: '#4a5568',
    fontWeight: '400',
  },
  weightSection: {
    paddingBottom: 16,
    alignItems: 'flex-end',
  },
  weightValue: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: -1.5,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  weightUnit: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 4,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  weightLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    marginTop: 2,
    opacity: 0.95,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomSection: {
    marginTop: 4,
    zIndex: 10,
    position: 'relative',
  },
  speechBubbleWrapper: {
    position: 'relative',
    marginLeft: 8,
    marginBottom: 20,
    width: '95%',
  },
  speechBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Reduced transparency by making it more solid
    borderRadius: 24,
    borderBottomLeftRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    overflow: 'hidden', // Ensure blur stays inside border
  },
  bubbleTail: {
    position: 'absolute',
    bottom: 0,
    left: -8,
    zIndex: 10,
    transform: [{ scale: 0.8 }],
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  magicAiContainer: {
    width: 32,
    height: 32,
    borderRadius: 16, // Fully circular for a magic icon
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#8EC5FC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  chatText: {
    color: '#1a202c',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flexShrink: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a202c',
    letterSpacing: -0.5,
  },
  statUnit: {
    fontSize: 10,
    fontWeight: '500',
    color: '#4a5568',
    marginLeft: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#718096',
    fontWeight: '500',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginHorizontal: 6,
  },
  arrowButton: {
    width: 32,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
});
