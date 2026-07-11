import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stethoscope, Activity, RefreshCcw } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export default function HealthJourneyTimeline() {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.text }]}>My Health Journey</Text>
        <TouchableOpacity>
          <Text style={styles.viewTimelineText}>View Timeline</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.timelineWrapper, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
        <View style={styles.nodesContainer}>
          
          {/* Node 1: Diagnosis */}
          <View style={styles.nodeItem}>
            <View style={[styles.iconCircle, styles.completedCircle]}>
              <Stethoscope size={20} color="#FFFFFF" />
            </View>
            <Text style={[styles.nodeTitle, { color: colors.text }]}>Diagnosis</Text>
            <Text style={[styles.nodeStatus, styles.completedText]}>Completed</Text>
          </View>

          {/* Line 1 */}
          <View style={[styles.line, styles.completedLine]}>
            <View style={styles.dot} />
          </View>

          {/* Node 2: Treatment */}
          <View style={styles.nodeItem}>
            <View style={[styles.iconCircle, styles.completedCircle]}>
              <Activity size={20} color="#FFFFFF" />
            </View>
            <Text style={[styles.nodeTitle, { color: colors.text }]}>Treatment</Text>
            <Text style={[styles.nodeStatus, styles.completedText]}>In Progress</Text>
          </View>

          {/* Line 2 */}
          <View style={[styles.line, styles.pendingLine]}>
            <View style={[styles.dot, styles.pendingDot]} />
          </View>

          {/* Node 3: Recovery */}
          <View style={styles.nodeItem}>
            <View style={[styles.iconCircle, styles.pendingCircle, { backgroundColor: isDark ? '#333' : '#E5E7EB' }]}>
              <RefreshCcw size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </View>
            <Text style={[styles.nodeTitle, { color: colors.text }]}>Recovery</Text>
            <Text style={[styles.nodeStatus, { color: colors.textMuted }]}>Next Step</Text>
          </View>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  viewTimelineText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  timelineWrapper: {
    borderRadius: 24,
    padding: 24,
  },
  nodesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    position: 'relative',
  },
  nodeItem: {
    alignItems: 'center',
    width: 80,
    zIndex: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  completedCircle: {
    backgroundColor: '#10B981',
  },
  pendingCircle: {
    backgroundColor: '#E5E7EB',
  },
  nodeTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  nodeStatus: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  completedText: {
    color: '#10B981',
  },
  line: {
    position: 'absolute',
    top: 23,
    height: 2,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedLine: {
    left: 60,
    width: '28%',
    backgroundColor: '#10B981',
  },
  pendingLine: {
    right: 60,
    width: '28%',
    backgroundColor: '#E5E7EB',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  pendingDot: {
    backgroundColor: '#9CA3AF',
  }
});
