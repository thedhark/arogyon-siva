import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, Plus, Smartphone, Star, Wallet, History, Download, ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import { useProfileStore } from '@/hooks/useProfileStore';
import { ActionBottomSheet, ActionBottomSheetRef } from '@/components/ActionBottomSheet';
import PaymentForm from '@/components/profile/PaymentForm';
import { formatDisplayDate } from '@/utils';

export default function PaymentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  
  const paymentMethods = useProfileStore(state => state.paymentMethods);
  const setPrimaryPayment = useProfileStore(state => state.setPrimaryPayment);
  const walletBalance = useProfileStore(state => state.walletBalance);
  const transactions = useProfileStore(state => state.transactions);
  const addFunds = useProfileStore(state => state.addFunds);
  const bottomSheetRef = useRef<ActionBottomSheetRef>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AnimatedScreen entrance="fade" style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Payments & Wallet</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Arogyon Wallet Card */}
        <View style={[styles.walletCard, { backgroundColor: isDark ? '#1E1E1E' : '#10B981' }]}>
          <View style={styles.walletHeader}>
            <View style={styles.walletTitleRow}>
              <Wallet size={20} color="#FFFFFF" />
              <Text style={styles.walletTitle}>Arogyon Wallet</Text>
            </View>
            <Text style={styles.walletSubtitle}>Available Balance</Text>
          </View>
          <Text style={styles.walletBalance}>{formatCurrency(walletBalance)}</Text>
          
          <TouchableOpacity 
            style={styles.addFundsBtn}
            onPress={() => {
              // Simulate adding funds
              addFunds(1000);
            }}
          >
            <Plus size={18} color={isDark ? '#FFFFFF' : '#10B981'} />
            <Text style={[styles.addFundsText, { color: isDark ? '#FFFFFF' : '#10B981' }]}>Add Funds</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Payment Methods</Text>
        
        {paymentMethods.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <View style={styles.iconCircle}>
              <CreditCard size={32} color="#10B981" />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Payment Methods</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              Add a card or UPI ID for faster checkouts when booking appointments.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {paymentMethods.map(method => (
              <TouchableOpacity 
                key={method.id} 
                style={[
                  styles.card, 
                  { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: method.isPrimary ? colors.accent : (isDark ? '#333' : '#F0F0F0') },
                  method.isPrimary && { borderWidth: 2 }
                ]}
                onPress={() => setPrimaryPayment(method.id)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.methodIcon}>
                    {method.type === 'card' ? (
                      <CreditCard size={24} color={colors.text} />
                    ) : (
                      <Smartphone size={24} color={colors.text} />
                    )}
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={[styles.methodDetails, { color: colors.text }]}>{method.details}</Text>
                    <Text style={[styles.methodType, { color: colors.textSecondary }]}>
                      {method.type === 'card' ? 'Credit/Debit Card' : 'UPI ID'}
                    </Text>
                  </View>
                  {method.isPrimary && (
                    <View style={[styles.primaryBadge, { backgroundColor: colors.accent + '20' }]}>
                      <Star size={14} color={colors.accent} fill={colors.accent} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Pressable 
          style={[styles.addCard, { borderColor: colors.accent, borderStyle: 'dashed' }]}
          onPress={() => bottomSheetRef.current?.present()}
        >
          <View style={[styles.addIconWrap, { backgroundColor: colors.accent + '15' }]}>
            <Plus size={24} color={colors.accent} />
          </View>
          <Text style={[styles.addText, { color: colors.accent }]}>Add Payment Method</Text>
        </Pressable>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 32 }]}>Recent Transactions</Text>
        
        <View style={styles.transactionsList}>
          {transactions.length === 0 ? (
             <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>No recent transactions.</Text>
          ) : (
            transactions.map((tx) => (
              <View key={tx.id} style={[styles.transactionItem, { borderBottomColor: isDark ? '#333' : '#F0F0F0' }]}>
                <View style={[styles.txIconWrap, { backgroundColor: tx.type === 'credit' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
                  {tx.type === 'credit' ? (
                    <ArrowDownLeft size={20} color="#10B981" />
                  ) : (
                    <ArrowUpRight size={20} color="#EF4444" />
                  )}
                </View>
                <View style={styles.txInfo}>
                  <Text style={[styles.txTitle, { color: colors.text }]} numberOfLines={1}>{tx.title}</Text>
                  <Text style={[styles.txDate, { color: colors.textSecondary }]}>
                    {formatDisplayDate(tx.date)}
                  </Text>
                </View>
                <View style={styles.txRight}>
                  <Text style={[styles.txAmount, { color: tx.type === 'credit' ? '#10B981' : colors.text }]}>
                    {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </Text>
                  <TouchableOpacity style={styles.downloadBtn}>
                    <Download size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

      </ScrollView>

      <ActionBottomSheet ref={bottomSheetRef} snapPoints={['88%']}>
        <PaymentForm onSuccess={() => bottomSheetRef.current?.dismiss()} />
      </ActionBottomSheet>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  backBtn: { paddingRight: 16 },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  content: { padding: 20 },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 32, borderRadius: 24, marginTop: 20, marginBottom: 20 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(16, 185, 129, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  list: { gap: 16, marginBottom: 20, marginTop: 10 },
  card: { padding: 20, borderRadius: 16, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  methodIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.05)', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  methodInfo: { flex: 1 },
  methodDetails: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  methodType: { fontSize: 14 },
  primaryBadge: { padding: 8, borderRadius: 20 },
  addCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, borderWidth: 2, height: 80 },
  addIconWrap: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  addText: { fontSize: 16, fontWeight: '600' },
  walletCard: { padding: 24, borderRadius: 24, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
  walletHeader: { marginBottom: 16 },
  walletTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  walletTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  walletSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 },
  walletBalance: { color: '#FFFFFF', fontSize: 36, fontWeight: '800', marginBottom: 20 },
  addFundsBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  addFundsText: { fontSize: 14, fontWeight: '700', marginLeft: 6 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  transactionsList: { gap: 16, paddingBottom: 20 },
  transactionItem: { flexDirection: 'row', alignItems: 'center', paddingBottom: 16, borderBottomWidth: 1 },
  txIconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  txInfo: { flex: 1 },
  txTitle: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  txDate: { fontSize: 13 },
  txRight: { alignItems: 'flex-end', marginLeft: 16 },
  txAmount: { fontSize: 15, fontWeight: '700', marginBottom: 8 },
  downloadBtn: { padding: 4, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 12 }
});
