import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, ClipboardList } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';

export default function ReportsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  return (
    <AnimatedScreen entrance="fade" style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Reports</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.emptyState, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <View style={styles.iconCircle}>
            <ClipboardList size={32} color="#8B5CF6" />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Lab Reports</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
            Upload your lab test reports or book a test to see them here.
          </Text>
        </View>
      </ScrollView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  backBtn: { paddingRight: 16 },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  content: { padding: 20 },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 32, borderRadius: 24, marginTop: 40 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(139, 92, 246, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
