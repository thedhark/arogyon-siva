import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { CheckCircle } from 'lucide-react-native';

const WORKFLOW = [
  { id: '1', title: 'Diagnosis & Assessment', duration: 'Days 1 - 3', desc: 'Consult with expert & get a clear understanding of your condition.', status: 'completed' },
  { id: '2', title: 'Pre-Care', duration: 'Days 4 - 7', desc: 'Prepare your body with exercises and therapy.', status: 'completed' },
  { id: '3', title: 'Treatment', duration: 'Days 8 - 21', desc: 'Physiotherapy, medication & pain management.', status: 'completed' },
  { id: '4', title: 'Recovery & Physiotherapy', duration: 'Days 22 - 40', desc: 'Advanced physiotherapy & strength building.', status: 'active' },
  { id: '5', title: 'Prevention & Maintenance', duration: 'Days 41 - 45', desc: 'Lifestyle guidance & long-term exercises.', status: 'upcoming' },
];

export default function PlanWorkflowTimeline() {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Recovery Journey</Text>
      
      <View style={styles.timelineContainer}>
        {WORKFLOW.map((step, index) => {
          const isLast = index === WORKFLOW.length - 1;
          const isCompleted = step.status === 'completed';
          const isActive = step.status === 'active';
          
          return (
            <View key={step.id} style={[
              styles.stepRow, 
              isActive && [styles.activeRow, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : '#F0FDF4' }]
            ]}>
              {/* Timeline Line & Icon */}
              <View style={styles.timelineVisual}>
                <View style={[
                  styles.circle,
                  isCompleted && { borderColor: '#D1D5DB' },
                  isActive && { backgroundColor: '#10B981', borderColor: '#10B981' },
                  !isCompleted && !isActive && { borderColor: '#E5E7EB' }
                ]}>
                  <Text style={[
                    styles.circleText,
                    isActive && { color: '#FFF' },
                    isDark && !isActive && { color: '#FFF' }
                  ]}>{step.id}</Text>
                </View>
                {!isLast && (
                  <View style={[
                    styles.timelineLine, 
                    { backgroundColor: (isCompleted || isActive) ? '#10B981' : (isDark ? '#333' : '#E5E7EB') }
                  ]} />
                )}
              </View>
              
              {/* Content */}
              <View style={[
                styles.stepContent, 
                { 
                  paddingBottom: isLast ? 0 : 24,
                  borderBottomWidth: (!isLast && !isActive) ? 1 : 0,
                  borderBottomColor: isDark ? '#333' : '#F3F4F6',
                  marginBottom: isLast ? 0 : 12,
                }
              ]}>
                <View style={styles.contentHeader}>
                  <Text style={[styles.stepTitle, isActive ? { color: '#10B981' } : { color: colors.text }]}>{step.title}</Text>
                  {isCompleted && <CheckCircle size={18} color="#10B981" fill="#10B981" />}
                </View>
                <Text style={[styles.stepDuration, { color: colors.textMuted }]}>{step.duration}</Text>
                <Text style={[styles.stepDesc, { color: colors.text }]}>{step.desc}</Text>
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
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 24,
  },
  timelineContainer: {
    // Wrapper for all items
  },
  stepRow: {
    flexDirection: 'row',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginLeft: -8, // Offset padding
  },
  activeRow: {
    // Background applied in style array
  },
  timelineVisual: {
    alignItems: 'center',
    width: 30,
    marginRight: 16,
    position: 'relative',
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  circleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827', // default
  },
  timelineLine: {
    width: 2,
    position: 'absolute',
    top: 28,
    bottom: -12, // Connects to next circle
    left: 13,
    zIndex: 1,
  },
  stepContent: {
    flex: 1,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  stepDuration: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
  },
  stepDesc: {
    fontSize: 13,
    lineHeight: 18,
  }
});
