import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Package, Clock, CheckCircle2, XCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import { useRecordsStore } from '@/hooks/useRecordsStore';

export default function OrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  
  const orders = useRecordsStore((state) => state.orders);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Delivered': return '#10B981'; // Green
      case 'Processing': return '#F59E0B'; // Orange
      case 'Shipped': return '#3B82F6'; // Blue
      case 'Cancelled': return '#EF4444'; // Red
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Delivered': return <CheckCircle2 size={16} color="#10B981" />;
      case 'Processing': return <Clock size={16} color="#F59E0B" />;
      case 'Shipped': return <Package size={16} color="#3B82F6" />;
      case 'Cancelled': return <XCircle size={16} color="#EF4444" />;
      default: return null;
    }
  };

  return (
    <AnimatedScreen entrance="fade" style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Orders</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {orders.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <View style={styles.iconCircle}>
              <Package size={32} color="#10B981" />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Orders Yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              When you order medicines or book lab tests, they will appear here.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {orders.map((order) => (
              <View 
                key={order.id} 
                style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' }]}
              >
                <View style={styles.cardHeader}>
                  <Text style={[styles.orderId, { color: colors.text }]}>{order.id}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '15' }]}>
                    {getStatusIcon(order.status)}
                    <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>{order.status}</Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  {order.items.map((item, index) => (
                    <Text key={index} style={[styles.itemText, { color: colors.textSecondary }]}>
                      • {item}
                    </Text>
                  ))}
                </View>

                <View style={styles.cardFooter}>
                  <Text style={[styles.dateText, { color: colors.textMuted }]}>{order.date}</Text>
                  <Text style={[styles.totalText, { color: colors.text }]}>{order.total}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backBtn: { paddingRight: 16 },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  content: { padding: 20 },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    borderRadius: 24,
    marginTop: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  list: { gap: 16 },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: { fontSize: 16, fontWeight: '700' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: { fontSize: 12, fontWeight: '700' },
  cardBody: { marginBottom: 16 },
  itemText: { fontSize: 14, marginBottom: 4 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 12,
  },
  dateText: { fontSize: 13, fontWeight: '500' },
  totalText: { fontSize: 16, fontWeight: '700' },
});
