import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, SharedValue } from 'react-native-reanimated';
import { ArrowLeft, Share2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

const HEADER_HEIGHT = 280;

interface Props {
  scrollY: SharedValue<number>;
  title: string;
}

export default function PlanHeroNav({ scrollY, title }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  const headerBgStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [HEADER_HEIGHT - 100, HEADER_HEIGHT], [0, 1], Extrapolation.CLAMP);
    return { opacity };
  });

  const textColor = isDark ? '#FFF' : '#111827';

  return (
    <>
      <Animated.View style={[
        styles.solidHeader, 
        { 
          paddingTop: insets.top, 
          height: insets.top + 60,
          backgroundColor: isDark ? '#121212' : '#FFFFFF' 
        }, 
        headerBgStyle
      ]}>
        <Text style={[styles.solidHeaderTitle, { color: textColor }]}>{title}</Text>
      </Animated.View>

      <View style={[styles.headerActions, { top: insets.top + 10, height: 40 }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} color={textColor} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Share2 size={22} color={textColor} />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerActions: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solidHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  solidHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
  }
});
