import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MEDICAL_ILLUSTRATIONS } from '@/constants/medical-illustrations';

export default function FamilyBanner() {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.container}>
      <View style={styles.bannerContainer}>
        <View style={styles.content}>
          <Text style={styles.tagText}>FAMILY PROTECTION</Text>
          <Text style={styles.title}>Care for your{'\n'}loved ones</Text>
        </View>
        <Image source={MEDICAL_ILLUSTRATIONS.family} style={styles.image} contentFit="cover" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  bannerContainer: {
    height: 180,
    borderRadius: 20,
    backgroundColor: '#0b2b5b',
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 24,
    paddingVertical: 20,
  },
  tagText: {
    color: '#4ade80',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  image: {
    width: 140,
    height: '100%',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  }
});
