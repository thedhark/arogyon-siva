import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, Video, Scale, Heart } from 'lucide-react-native';

interface Props {
  colors: any;
  isDark: boolean;
}

export default function QuickActionsRow({ colors, isDark }: Props) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick actions</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsScroll}>
        
        <TouchableOpacity style={[styles.actionCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F3F4F6' }]}>
          <View style={[styles.actionIconBox, { backgroundColor: '#8B5CF6' }]}>
            <Plus size={16} color="#FFFFFF" />
          </View>
          <Text style={[styles.actionText, { color: colors.text }]}>Add task</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F3F4F6' }]}>
          <View style={[styles.actionIconBox, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
            <Video size={16} color="#8B5CF6" />
          </View>
          <Text style={[styles.actionText, { color: colors.text }]}>Join session</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F3F4F6' }]}>
          <View style={[styles.actionIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
            <Scale size={16} color="#3B82F6" />
          </View>
          <Text style={[styles.actionText, { color: colors.text }]}>Log weight</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F3F4F6' }]}>
          <View style={[styles.actionIconBox, { backgroundColor: 'rgba(236, 72, 153, 0.1)' }]}>
            <Heart size={16} color="#EC4899" />
          </View>
          <Text style={[styles.actionText, { color: colors.text }]}>Log pain</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    paddingHorizontal: 12,
  },
  actionsScroll: {
    paddingHorizontal: 12,
    gap: 12,
    marginTop: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  actionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
