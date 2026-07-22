import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Calendar as CalendarIcon, FileText, Bell, CheckCircle2, ShieldAlert } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import Animated, { FadeInDown } from 'react-native-reanimated';

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'appointment',
    title: 'Appointment Reminder',
    message: 'You have an upcoming appointment with Dr. Sarah Smith tomorrow at 10:00 AM.',
    time: '2 hours ago',
    read: false,
    icon: CalendarIcon,
    color: '#3B82F6',
  },
  {
    id: '2',
    type: 'report',
    title: 'Lab Report Ready',
    message: 'Your CBC lab report is ready to view and download.',
    time: 'Yesterday',
    read: false,
    icon: FileText,
    color: '#10B981',
  },
  {
    id: '3',
    type: 'system',
    title: 'Welcome to Arogyon Premium',
    message: 'Your premium subscription is active. Enjoy priority bookings and more.',
    time: '2 days ago',
    read: true,
    icon: ShieldAlert,
    color: '#8B5CF6',
  },
  {
    id: '4',
    type: 'alert',
    title: 'Prescription Expiring',
    message: 'Your current prescription for blood pressure medication is expiring soon.',
    time: '5 days ago',
    read: true,
    icon: Bell,
    color: '#F59E0B',
  },
];

export default function NotificationsScreen() {
  const { colors, isDark } = useTheme();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <AnimatedScreen entrance="fade">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={28} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.listHeader}>
            <Text style={[styles.countText, { color: colors.textSecondary }]}>
              You have <Text style={[styles.countHighlight, { color: colors.accent }]}>{unreadCount}</Text> unread alerts
            </Text>
            {unreadCount > 0 && (
              <Pressable onPress={markAllAsRead} style={styles.markAllBtn}>
                <CheckCircle2 size={16} color={colors.accent} />
                <Text style={[styles.markAllText, { color: colors.accent }]}>Mark all read</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.list}>
            {notifications.map((notif, index) => {
              const Icon = notif.icon;
              return (
                <Animated.View key={notif.id} entering={FadeInDown.delay(100 + index * 50)}>
                  <Pressable 
                    style={[
                      styles.card, 
                      { 
                        backgroundColor: isDark ? '#1E1E1E' : (notif.read ? '#FFFFFF' : colors.accent + '08'), 
                        borderColor: isDark ? '#333' : (notif.read ? '#F0F0F0' : colors.accent + '30') 
                      }
                    ]}
                  >
                    <View style={[styles.iconWrap, { backgroundColor: notif.color + '15' }]}>
                      <Icon size={24} color={notif.color} />
                    </View>
                    
                    <View style={styles.content}>
                      <View style={styles.titleRow}>
                        <Text style={[styles.title, { color: colors.text }]}>{notif.title}</Text>
                        <Text style={[styles.time, { color: colors.textSecondary }]}>{notif.time}</Text>
                      </View>
                      <Text style={[styles.message, { color: colors.textSecondary }]} numberOfLines={2}>
                        {notif.message}
                      </Text>
                    </View>

                    {!notif.read && (
                      <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />
                    )}
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>

        </ScrollView>
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  countText: {
    fontSize: 14,
  },
  countHighlight: {
    fontWeight: '700',
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  time: {
    fontSize: 12,
    marginLeft: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 12,
    marginTop: 6,
  }
});
