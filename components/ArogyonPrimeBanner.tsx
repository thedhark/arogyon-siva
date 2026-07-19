import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Crown, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ArogyonPrimeBanner() {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.container}>
      <LinearGradient
        colors={['#FFF8E1', '#FFF4CC', '#FFE082']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['#D4AF37', '#B8860B']}
            style={styles.circle}
          >
            <Crown color="#FFF" size={24} />
          </LinearGradient>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>ArogyoN Prime</Text>
          <Text style={styles.subtitle}>Free consultations • Discounts • Faster appointments</Text>
        </View>

        <View style={styles.button}>
          <Text style={styles.buttonText}>Join Now</Text>
          <ChevronRight size={14} color="#B8860B" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginBottom: 24,
    borderRadius: 16,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#444',
    fontWeight: '500',
    lineHeight: 18,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B8860B',
    marginRight: 2,
  },
});
