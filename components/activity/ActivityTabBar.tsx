import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar } from 'lucide-react-native';

interface Props {
  isDark: boolean;
  colors: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  TABS: any[];
}

export default function ActivityTabBar({ isDark, colors, activeTab, setActiveTab, TABS }: Props) {
  return (
    <View style={styles.tabsWrapper}>
      <View style={[styles.tabsContainer, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', shadowColor: isDark ? '#000' : '#9CA3AF' }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          
          <View style={styles.dateSelector}>
            <Text style={styles.dateDay}>Tue</Text>
            <View style={styles.dateBottom}>
              <Text style={[styles.dateText, { color: colors.text }]}>21 May</Text>
              <Calendar size={14} color="#8B5CF6" style={{ marginLeft: 4 }} />
            </View>
          </View>

          <View style={styles.tabDivider} />

          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <TouchableOpacity 
                key={tab.id} 
                style={styles.tabItem}
                onPress={() => setActiveTab(tab.id)}
              >
                <View style={[styles.tabIconBox, isActive && { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                  <Icon size={20} color={isActive ? '#8B5CF6' : colors.textMuted} />
                </View>
                <Text style={[styles.tabLabel, { color: isActive ? '#8B5CF6' : colors.textMuted, fontWeight: isActive ? '700' : '500' }]}>
                  {tab.label}
                </Text>
                {isActive && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabsWrapper: {
    paddingHorizontal: 12,
    marginBottom: 24,
    zIndex: 10,
  },
  tabsContainer: {
    borderRadius: 24,
    paddingVertical: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  tabsScroll: {
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 16,
  },
  dateSelector: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 2,
  },
  dateBottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '800',
  },
  tabDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  tabItem: {
    alignItems: 'center',
    position: 'relative',
    minWidth: 64,
  },
  tabIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  tabLabel: {
    fontSize: 12,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -16,
    width: 32,
    height: 3,
    backgroundColor: '#8B5CF6',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});
