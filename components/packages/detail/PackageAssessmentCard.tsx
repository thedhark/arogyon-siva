import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stethoscope, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';

interface Props {
  isDark?: boolean;
  style?: any;
}

export default function PackageAssessmentCard({ isDark, style }: Props) {
  const theme = useTheme();
  const activeDark = isDark ?? theme.isDark;

  const journeySteps = [
    {
      id: 'step-1',
      icon: Stethoscope,
      iconColor: activeDark ? '#C084FC' : '#7C3AED',
      iconBg: activeDark ? 'rgba(124, 58, 237, 0.15)' : '#F5F3FF',
      title: 'Senior Specialist Clinical Review',
      description: 'Comprehensive in-person consultation and clinical assessment included.',
    },
    {
      id: 'step-2',
      icon: ShieldCheck,
      iconColor: activeDark ? '#34D399' : '#059669',
      iconBg: activeDark ? 'rgba(5, 150, 105, 0.15)' : '#ECFDF5',
      title: '100% Price Lock Guarantee',
      description: 'Zero hidden hospital fees. Complete coverage for all stated procedures.',
    },
    {
      id: 'step-3',
      icon: HeartHandshake,
      iconColor: activeDark ? '#60A5FA' : '#2563EB',
      iconBg: activeDark ? 'rgba(37, 99, 235, 0.15)' : '#EFF6FF',
      title: 'Personal Care Coordinator',
      description: 'Dedicated Arogyon manager for fast-track entry and insurance assistance.',
    },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: activeDark ? '#18181B' : '#FFFFFF',
          borderColor: activeDark ? '#27272A' : '#E2E8F0',
        },
        style,
      ]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View
          style={[
            styles.headerIconContainer,
            { backgroundColor: activeDark ? 'rgba(167, 139, 250, 0.15)' : '#F5F3FF' },
          ]}
        >
          <Sparkles size={16} color={activeDark ? '#A78BFA' : '#6527BE'} />
        </View>
        <View style={styles.headerTextCol}>
          <Text style={[styles.headerTitle, { color: activeDark ? '#F4F4F5' : '#0F172A' }]}>
            Hospital Care Journey
          </Text>
          <Text style={[styles.headerSubtitle, { color: activeDark ? '#A1A1AA' : '#64748B' }]}>
            Included with this package
          </Text>
        </View>
      </View>

      {/* Steps List */}
      <View style={styles.stepsContainer}>
        {journeySteps.map((step, index) => {
          const IconComponent = step.icon;
          const isLast = index === journeySteps.length - 1;

          return (
            <View key={step.id} style={styles.stepItem}>
              {/* Left Column: Icon + Connecting line */}
              <View style={styles.leftCol}>
                <View style={[styles.iconCircle, { backgroundColor: step.iconBg }]}>
                  <IconComponent size={17} color={step.iconColor} />
                </View>
                {!isLast && (
                  <View
                    style={[
                      styles.connectorLine,
                      { backgroundColor: activeDark ? '#27272A' : '#E2E8F0' },
                    ]}
                  />
                )}
              </View>

              {/* Right Column: Step Text */}
              <View style={[styles.rightCol, !isLast && { paddingBottom: 16 }]}>
                <Text style={[styles.stepTitle, { color: activeDark ? '#F4F4F5' : '#1E293B' }]}>
                  {step.title}
                </Text>
                <Text
                  style={[styles.stepDesc, { color: activeDark ? '#9CA3AF' : '#64748B' }]}
                >
                  {step.description}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 6,
    elevation: 0,
    shadowColor: 'transparent',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  headerIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontFamily: Fonts?.bold || 'System',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: Fonts?.medium || 'System',
    fontWeight: '500',
    marginTop: 1,
  },
  stepsContainer: {
    paddingTop: 2,
  },
  stepItem: {
    flexDirection: 'row',
  },
  leftCol: {
    alignItems: 'center',
    marginRight: 12,
    width: 32,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectorLine: {
    width: 1.5,
    flex: 1,
    marginVertical: 4,
  },
  rightCol: {
    flex: 1,
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 13.5,
    fontFamily: Fonts?.bold || 'System',
    fontWeight: '700',
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  stepDesc: {
    fontSize: 12,
    lineHeight: 17,
    fontFamily: Fonts?.regular || 'System',
    fontWeight: '400',
  },
});
