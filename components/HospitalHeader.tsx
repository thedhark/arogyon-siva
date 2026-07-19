import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ArrowLeft, Search, Share2 } from 'lucide-react-native';

interface HospitalHeaderProps {
  onBackPress: () => void;
  onSearchPress?: () => void;
  onSharePress: () => void;
}

export default function HospitalHeader({ onBackPress, onSearchPress, onSharePress }: HospitalHeaderProps) {
  return (
    <View style={styles.headerAbsolute}>
      <TouchableOpacity onPress={onBackPress} style={styles.iconCircle}>
        <ArrowLeft color="#fff" size={24} />
      </TouchableOpacity>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.iconCircle} onPress={onSearchPress}>
          <Search color="#fff" size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconCircle, { marginLeft: 12 }]} onPress={onSharePress}>
          <Share2 color="#fff" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerAbsolute: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    flexDirection: 'row',
  },
});
