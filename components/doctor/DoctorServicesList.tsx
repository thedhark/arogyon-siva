import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stethoscope, Check, Tag } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Fonts } from '@/constants/theme';

export interface DoctorServiceItem {
  id: string;
  name: string;
  price: string;
}

interface DoctorServicesListProps {
  services?: DoctorServiceItem[];
  selectedServiceId: string | null;
  onSelectService: (id: string | null) => void;
  tags?: string[];
  languages?: string[];
  isDark: boolean;
  colors: any;
}

export default function DoctorServicesList({
  services = [],
  selectedServiceId,
  onSelectService,
  tags = [],
  languages = [],
  isDark,
  colors,
}: DoctorServicesListProps) {
  const handleToggleService = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectService(selectedServiceId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      {/* Specialization Tags Strip */}
      {tags.length > 0 && (
        <View style={styles.tagsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Areas of Expertise
          </Text>
          <View style={styles.tagsRow}>
            {tags.map((tag) => (
              <View
                key={tag}
                style={[
                  styles.tagPill,
                  {
                    backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
                    borderColor: isDark ? '#334155' : '#DBEAFE',
                  },
                ]}
              >
                <Tag size={11} color="#3B82F6" />
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Services and Procedures */}
      {services.length > 0 && (
        <View
          style={[
            styles.card,
            {
              backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
              borderColor: isDark ? '#2C2C2E' : '#E5E7EB',
            },
          ]}
        >
          <View style={styles.headerRow}>
            <Stethoscope size={17} color="#10B981" />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Clinical Services & Procedures
            </Text>
          </View>
          <Text style={[styles.subtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            Select an optional specialized procedure or standard consult
          </Text>

          <View style={styles.servicesList}>
            {services.map((item) => {
              const isSelected = selectedServiceId === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  onPress={() => handleToggleService(item.id)}
                  style={[
                    styles.serviceRow,
                    {
                      backgroundColor: isSelected
                        ? (isDark ? '#064E3B' : '#ECFDF5')
                        : (isDark ? '#25252A' : '#F9FAFB'),
                      borderColor: isSelected
                        ? '#10B981'
                        : (isDark ? '#2C2C2E' : '#E5E7EB'),
                    },
                  ]}
                >
                  <View style={styles.serviceLeft}>
                    <View
                      style={[
                        styles.checkCircle,
                        {
                          backgroundColor: isSelected ? '#10B981' : 'transparent',
                          borderColor: isSelected ? '#10B981' : (isDark ? '#4B5563' : '#CBD5E1'),
                        },
                      ]}
                    >
                      {isSelected && <Check size={11} color="#FFFFFF" />}
                    </View>
                    <Text style={[styles.serviceName, { color: colors.text }]} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.servicePrice,
                      { color: isSelected ? '#10B981' : colors.text },
                    ]}
                  >
                    {item.price}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Languages Supported */}
      {languages.length > 0 && (
        <View style={styles.languagesContainer}>
          <Text style={[styles.languagesLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            Languages Spoken: <Text style={{ color: colors.text, fontWeight: '700' }}>{languages.join(' • ')}</Text>
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 14.5,
    fontFamily: Fonts.bold,
    fontWeight: '800',
    marginBottom: 8,
  },
  tagsContainer: {
    marginBottom: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 11.5,
    fontFamily: Fonts.bold,
    fontWeight: '700',
    color: '#3B82F6',
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14.5,
    fontFamily: Fonts.bold,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 11.5,
    fontFamily: Fonts.regular,
    marginBottom: 12,
  },
  servicesList: {
    gap: 8,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
  },
  serviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceName: {
    fontSize: 12.5,
    fontFamily: Fonts.medium,
    fontWeight: '600',
    flex: 1,
  },
  servicePrice: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    fontWeight: '800',
  },
  languagesContainer: {
    marginTop: 10,
    paddingHorizontal: 4,
  },
  languagesLabel: {
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
});
