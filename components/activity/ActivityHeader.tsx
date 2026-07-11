import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface Props {
  colors: any;
}

export default function ActivityHeader({ colors }: Props) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={[styles.headerGreeting, { color: colors.text }]}>Good morning, Arjun 👋</Text>
        <Text style={styles.headerSubtitle}>You're on day 12 of your journey</Text>
      </View>
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200' }} 
        style={styles.profilePic} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerGreeting: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  profilePic: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
});
