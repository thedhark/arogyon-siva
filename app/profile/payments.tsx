import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, Plus, Smartphone, Star, Wallet, History, Download, ArrowUpRight, ArrowDownLeft, Receipt, ShieldCheck } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import { useProfileStore } from '@/hooks/useProfileStore';
import { useBookingStore, Appointment } from '@/hooks/useBookingStore';
import { ActionBottomSheet, ActionBottomSheetRef } from '@/components/ActionBottomSheet';
import PaymentForm from '@/components/profile/PaymentForm';
import PaymentStatsHeader from '@/components/payments/PaymentStatsHeader';
import BookingPaymentFilter, { PaymentFilterType } from '@/components/payments/BookingPaymentFilter';
import BookingPaymentCard from '@/components/payments/BookingPaymentCard';
import PaymentInvoiceModal from '@/components/payments/PaymentInvoiceModal';
import RefundDetailsModal from '@/components/payments/RefundDetailsModal';
import { formatDisplayDate } from '@/utils';

export default function PaymentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const paymentMethods = useProfileStore((state) => state.paymentMethods);
  const setPrimaryPayment = useProfileStore((state) => state.setPrimaryPayment);
  const walletBalance = useProfileStore((state) => state.walletBalance);
  const transactions = useProfileStore((state) => state.transactions);
  const addFunds = useProfileStore((state) => state.addFunds);

  const cardSheetRef = useRef<ActionBottomSheetRef>(null);

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

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Payments & Wallet</Text>
          <Text style={[styles.headerSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            Wallet balance, saved cards & payment methods
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Arogyon Health Wallet Card */}
        <View style={[styles.walletCard, { backgroundColor: isDark ? '#1C1F28' : '#005C4B' }]}>
          <View style={styles.walletHeader}>
            <View style={styles.walletTitleRow}>
              <Wallet size={20} color="#FFFFFF" />
              <Text style={styles.walletTitle}>Arogyon Health Wallet</Text>
            </View>
            <View style={styles.secureTag}>
              <ShieldCheck size={12} color="#34D399" />
              <Text style={styles.secureTagText}>Instant & Protected</Text>
            </View>
          </View>

          <Text style={styles.walletSubtitle}>Available Balance</Text>
          <Text style={styles.walletBalance}>{formatCurrency(walletBalance)}</Text>

          {/* Quick Add Funds Buttons */}
          <View style={styles.quickAddRow}>
            <TouchableOpacity
              style={styles.addFundsBtn}
              onPress={() => addFunds(500)}
              activeOpacity={0.8}
            >
              <Plus size={14} color="#005C4B" />
              <Text style={styles.addFundsText}>+₹500</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.addFundsBtn, styles.addFundsBtnHighlighted]}
              onPress={() => addFunds(1000)}
              activeOpacity={0.8}
            >
              <Plus size={14} color="#005C4B" />
              <Text style={styles.addFundsText}>+₹1,000</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addFundsBtn}
              onPress={() => addFunds(2000)}
              activeOpacity={0.8}
            >
              <Plus size={14} color="#005C4B" />
              <Text style={styles.addFundsText}>+₹2,000</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Saved Payment Methods Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Saved Payment Methods</Text>
          <TouchableOpacity
            style={styles.addSmallBtn}
            onPress={() => cardSheetRef.current?.present()}
            activeOpacity={0.7}
          >
            <Plus size={14} color={colors.accent} />
            <Text style={[styles.addSmallText, { color: colors.accent }]}>Add New</Text>
          </TouchableOpacity>
        </View>

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
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                    borderColor: method.isPrimary
                      ? colors.accent
                      : isDark
                      ? '#333'
                      : '#F0F0F0',
                  },
                  method.isPrimary && { borderWidth: 2 },
                ]}
                onPress={() => setPrimaryPayment(method.id)}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.methodIcon,
                      {
                        backgroundColor:
                          method.type === 'upi'
                            ? 'rgba(59, 130, 246, 0.1)'
                            : 'rgba(16, 185, 129, 0.1)',
                      },
                    ]}
                  >
                    {method.type === 'upi' ? (
                      <Smartphone size={22} color="#3B82F6" />
                    ) : (
                      <CreditCard size={22} color="#10B981" />
                    )}
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={[styles.methodDetails, { color: colors.text }]}>
                      {method.details}
                    </Text>
                    <Text style={[styles.methodType, { color: colors.textSecondary }]}>
                      {method.type === 'upi' ? 'UPI ID' : 'Credit / Debit Card'}
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

        {/* Wallet Activity Log */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 28 }]}>
          Wallet Activity Log
        </Text>

        <View style={styles.transactionsList}>
          {transactions.length === 0 ? (
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              No wallet activity recorded.
            </Text>
          ) : (
            transactions.map((tx) => (
              <View
                key={tx.id}
                style={[styles.transactionItem, { borderBottomColor: isDark ? '#333' : '#F0F0F0' }]}
              >
                <View
                  style={[
                    styles.txIconWrap,
                    {
                      backgroundColor:
                        tx.type === 'credit'
                          ? 'rgba(16, 185, 129, 0.1)'
                          : 'rgba(239, 68, 68, 0.1)',
                    },
                  ]}
                >
                  {tx.type === 'credit' ? (
                    <ArrowDownLeft size={20} color="#10B981" />
                  ) : (
                    <ArrowUpRight size={20} color="#EF4444" />
                  )}
                </View>
                <View style={styles.txInfo}>
                  <Text style={[styles.txTitle, { color: colors.text }]} numberOfLines={1}>
                    {tx.title}
                  </Text>
                  <Text style={[styles.txDate, { color: colors.textSecondary }]}>
                    {formatDisplayDate(tx.date)}
                  </Text>
                </View>
                <View style={styles.txRight}>
                  <Text
                    style={[
                      styles.txAmount,
                      { color: tx.type === 'credit' ? '#10B981' : colors.text },
                    ]}
                  >
                    {tx.type === 'credit' ? '+' : '-'}
                    {formatCurrency(tx.amount)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Payment Method Bottom Sheet */}
      <ActionBottomSheet ref={cardSheetRef} snapPoints={['88%']}>
        <PaymentForm onSuccess={() => cardSheetRef.current?.dismiss()} />
      </ActionBottomSheet>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  walletCard: {
    padding: 22,
    borderRadius: 22,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  walletTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  walletTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  secureTagText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
  },
  walletSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginBottom: 2,
  },
  walletBalance: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  quickAddRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addFundsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 9,
    borderRadius: 12,
    gap: 4,
  },
  addFundsBtnHighlighted: {
    backgroundColor: '#DCFCE7',
  },
  addFundsText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#005C4B',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16.5,
    fontWeight: '800',
  },
  addSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addSmallText: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    borderRadius: 20,
    marginBottom: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  list: {
    gap: 12,
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  methodInfo: {
    flex: 1,
  },
  methodDetails: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  methodType: {
    fontSize: 12.5,
  },
  primaryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  transactionsList: {
    gap: 12,
    marginTop: 12,
    paddingBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  txIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  txDate: {
    fontSize: 12,
  },
  txRight: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
});
