import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ChevronDown, ChevronUp, BadgePercent, Check, Copy } from 'lucide-react-native';
import { HospitalOffer } from '@/constants/hospitalOffers';

interface HospitalCouponCardProps {
  offer: HospitalOffer;
  isDark?: boolean;
  onApplyCode?: (code: string) => void;
}

export default function HospitalCouponCard({
  offer,
  isDark = false,
  onApplyCode,
}: HospitalCouponCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    setCopied(true);
    if (onApplyCode) {
      onApplyCode(offer.code);
    }
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: isDark ? '#1C1929' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
        },
      ]}
    >
      <TouchableOpacity
        style={styles.mainRow}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.iconBox}>
          <BadgePercent size={22} color="#3B82F6" fill="#EFF6FF" />
        </View>

        <View style={styles.infoCol}>
          <Text
            style={[
              styles.offerTitle,
              { color: isDark ? '#FFFFFF' : '#0F172A' },
            ]}
          >
            {offer.title}
          </Text>
          <Text style={[styles.offerSubtext, { color: isDark ? '#9CA3AF' : '#64748B' }]}>
            {offer.subtext}
          </Text>
        </View>

        <View style={styles.chevronBox}>
          {isExpanded ? (
            <ChevronUp size={20} color={isDark ? '#9CA3AF' : '#64748B'} />
          ) : (
            <ChevronDown size={20} color={isDark ? '#9CA3AF' : '#64748B'} />
          )}
        </View>
      </TouchableOpacity>

      {/* Promo Code Pill Capsule */}
      <View style={styles.codeCapsuleRow}>
        <TouchableOpacity
          style={[
            styles.codeCapsule,
            {
              backgroundColor: isDark ? '#262238' : '#FAFAFA',
              borderColor: copied ? '#00A981' : (isDark ? 'rgba(255,255,255,0.15)' : '#E2E8F0'),
            },
          ]}
          onPress={handleCopyCode}
          activeOpacity={0.8}
        >
          <Text style={[styles.codeText, { color: isDark ? '#D1D5DB' : '#475569' }]}>
            {offer.code}
          </Text>
          {copied ? (
            <Check size={14} color="#00A981" />
          ) : (
            <Copy size={13} color={isDark ? '#9CA3AF' : '#94A3B8'} />
          )}
        </TouchableOpacity>
      </View>

      {/* Expanded Terms & Details */}
      {isExpanded && offer.terms && offer.terms.length > 0 && (
        <View style={[styles.detailsSection, { borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' }]}>
          <Text style={[styles.termsHeading, { color: isDark ? '#9CA3AF' : '#64748B' }]}>Terms & Conditions</Text>
          {offer.terms.map((term, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={[styles.termText, { color: isDark ? '#D1D5DB' : '#475569' }]}>{term}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconBox: {
    marginRight: 12,
    marginTop: 2,
  },
  infoCol: {
    flex: 1,
    paddingRight: 8,
  },
  offerTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  offerSubtext: {
    fontSize: 13,
    fontWeight: '500',
  },
  chevronBox: {
    padding: 2,
  },
  codeCapsuleRow: {
    marginTop: 10,
    flexDirection: 'row',
  },
  codeCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    gap: 8,
  },
  codeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  detailsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  termsHeading: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bulletDot: {
    fontSize: 12,
    color: '#00A981',
    marginRight: 6,
  },
  termText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
});
