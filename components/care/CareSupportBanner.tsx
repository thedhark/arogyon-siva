import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface Props {
  colors: any;
  isDark: boolean;
}

export default function CareSupportBanner({ colors, isDark }: Props) {
  return (
    <View style={styles.supportContainer}>
      <View style={[styles.supportBanner, { backgroundColor: isDark ? '#1E1E1E' : '#F8FAFC', borderColor: isDark ? '#333' : '#E2E8F0' }]}>
        <View style={styles.supportImages}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=100' }} style={styles.supportImg1} />
          <Image source={{ uri: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=100' }} style={styles.supportImg2} />
        </View>
        <View style={styles.supportContent}>
          <Text style={[styles.supportTitle, { color: colors.text }]}>Need help choosing the right care?</Text>
          <Text style={styles.supportSubtitle}>Get guidance from our care experts</Text>
        </View>
        <TouchableOpacity style={styles.chatBtn}>
          <Text style={styles.chatBtnText}>Chat Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  supportContainer: {
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  supportBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  supportImages: {
    width: 48,
    height: 40,
    marginRight: 12,
    position: 'relative',
  },
  supportImg1: {
    width: 32,
    height: 32,
    borderRadius: 16,
    position: 'absolute',
    left: 0,
    zIndex: 2,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  supportImg2: {
    width: 32,
    height: 32,
    borderRadius: 16,
    position: 'absolute',
    left: 16,
    zIndex: 1,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 2,
  },
  supportSubtitle: {
    fontSize: 10,
    color: '#6B7280',
  },
  chatBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  chatBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11,
  }
});
