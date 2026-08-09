import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronDown, HelpCircle } from 'lucide-react-native';

interface Props {
  isDark: boolean;
  colors: any;
}

const FAQS = [
  {
    q: 'Is fasting required for the test sample collection?',
    a: 'For blood profile and diagnostic packages, 10 to 12 hours of overnight fasting is required. Only plain water may be consumed during the fasting window.',
  },
  {
    q: 'How will I receive my reports and doctor consultation?',
    a: 'Digital reports are delivered to your Arogyon app within 24 hours. Once your reports are ready, a specialist doctor consult slot will automatically be scheduled.',
  },
  {
    q: 'Are these packages covered under health insurance or EMI?',
    a: 'Yes, 100% cashless insurance claims and 0% interest monthly EMI options are available at all NABH partner hospital centers.',
  },
  {
    q: 'Can I reschedule or cancel my package booking?',
    a: 'Free instant cancellation and 1-click rescheduling are available up to 2 hours prior to your scheduled home collection or hospital appointment.',
  },
];

export default function PackageFaqSection({ isDark, colors }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderColor: 'transparent',
        },
      ]}
    >
      <View style={styles.header}>
        <HelpCircle size={18} color="#0D9488" />
        <Text style={[styles.heading, { color: colors.text }]}>Frequently Asked Questions</Text>
      </View>

      <View style={styles.faqList}>
        {FAQS.map((faq, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <View
              key={idx}
              style={[
                styles.faqItem,
                { backgroundColor: isDark ? '#27272A' : '#F8FAFC', borderColor: 'transparent' },
              ]}
            >
              <TouchableOpacity
                onPress={() => toggleFaq(idx)}
                activeOpacity={0.7}
                style={styles.questionRow}
              >
                <Text style={[styles.questionText, { color: colors.text }]}>{faq.q}</Text>
                <ChevronDown
                  size={16}
                  color={colors.textSecondary}
                  style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}
                />
              </TouchableOpacity>

              {isExpanded && (
                <Text style={[styles.answerText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
                  {faq.a}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 0,
    padding: 18,
    marginBottom: 16,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  heading: {
    fontSize: 16,
    fontWeight: '800',
  },
  faqList: {
    gap: 10,
  },
  faqItem: {
    borderWidth: 0,
    borderRadius: 12,
    padding: 12,
    overflow: 'hidden',
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  questionText: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  answerText: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
});
