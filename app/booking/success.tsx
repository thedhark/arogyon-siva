import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { CheckCircle, Calendar, Clock, MapPin, Video, Phone } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

const { width } = Dimensions.get('window');

export default function SuccessScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#F5F7FA' }]}>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      
      <View style={styles.container}>
        <View style={styles.successIconWrapper}>
          <View style={styles.successIconInner}>
            <CheckCircle size={60} color="#10B981" />
          </View>
        </View>
        
        <Text style={[styles.title, { color: colors.text }]}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>Your appointment has been successfully scheduled.</Text>
        
        <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <Text style={[styles.doctorName, { color: colors.text }]}>Dr. Sneha Iyer</Text>
          <Text style={styles.specialty}>Gynaecologist</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Calendar size={18} color="#6B7280" />
            <Text style={[styles.detailText, { color: colors.text }]}>Monday, 14 Aug 2026</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Clock size={18} color="#6B7280" />
            <Text style={[styles.detailText, { color: colors.text }]}>03:00 PM - 03:30 PM</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MapPin size={18} color="#6B7280" />
            <Text style={[styles.detailText, { color: colors.text }]}>Apollo Hospitals</Text>
          </View>
          
          <View style={styles.typeBadge}>
            <Video size={14} color="#7C3AED" />
            <Text style={styles.typeText}>Video Consultation</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.primaryButtonText}>Go to Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>View Appointment Details</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successIconInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  doctorName: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: '#0D9488',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    width: '100%',
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
  },
  typeText: {
    color: '#7C3AED',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 6,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#EC4899',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontWeight: '700',
    fontSize: 15,
  },
});
