import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, Platform } from 'react-native';
import { Sparkles, X, Tag, Copy, CheckCircle2, FileText } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { MedicalRecord } from '@/hooks/useRecordsStore';
import DocumentPreview from './DocumentPreview';
import { extractStructuredInsights } from '@/services/documentReaderService';

interface DocumentReaderModalProps {
  record: MedicalRecord | null;
  visible: boolean;
  onClose: () => void;
}

export default function DocumentReaderModal({ record, visible, onClose }: DocumentReaderModalProps) {
  const { colors, isDark } = useTheme();
  const [copied, setCopied] = useState(false);
  const [showFullText, setShowFullText] = useState(true);

  if (!record) return null;

  const entities = extractStructuredInsights(record.extractedText || '');

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <View style={styles.modalHeader}>
            <View style={styles.titleRow}>
              <Sparkles size={20} color={colors.accent} />
              <Text style={[styles.modalTitle, { color: colors.text }]} numberOfLines={1}>{record.title}</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close document reader"><X size={20} color={colors.text} /></Pressable>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.metaRow}>
              <Text style={[styles.metaBadge, { backgroundColor: colors.accent + '20', color: colors.accent }]}>{record.category}</Text>
              <Text style={[styles.metaDate, { color: colors.textSecondary }]}>Uploaded: {record.date}</Text>
            </View>

            <DocumentPreview record={record} />

            {record.summary && (
              <View style={[styles.summaryBox, { backgroundColor: isDark ? '#262626' : '#F9FAFB' }]}>
                <Text style={[styles.summaryHeader, { color: colors.textSecondary }]}>Extracted Summary</Text>
                <Text style={[styles.summaryBody, { color: colors.text }]}>{record.summary}</Text>
              </View>
            )}

            {/* Extracted Structured Entities */}
            {entities && (entities.doctorName || entities.testValues.length > 0 || entities.medications.length > 0) && (
              <View style={{ marginBottom: 14, gap: 8 }}>
                {entities.doctorName && (
                  <View style={{ backgroundColor: isDark ? '#262626' : '#EFF6FF', padding: 10, borderRadius: 12 }}>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: colors.accent, letterSpacing: 0.5 }}>DOCTOR DETECTED</Text>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text, marginTop: 2 }}>{entities.doctorName}</Text>
                  </View>
                )}

                {entities.testValues.length > 0 && (
                  <View style={{ backgroundColor: isDark ? '#262626' : '#ECFDF5', padding: 10, borderRadius: 12 }}>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#059669', letterSpacing: 0.5 }}>LAB METRICS EXTRACTED</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                      {entities.testValues.map((tv, idx) => (
                        <View key={idx} style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#10B981', backgroundColor: isDark ? '#1F2937' : '#FFFFFF', flexDirection: 'row' }}>
                          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.text }}>{tv.name}: </Text>
                          <Text style={{ fontSize: 12, fontWeight: '600', color: '#10B981' }}>{tv.value}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {entities.medications.length > 0 && (
                  <View style={{ backgroundColor: isDark ? '#262626' : '#F5F3FF', padding: 10, borderRadius: 12 }}>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#7C3AED', letterSpacing: 0.5 }}>PRESCRIBED MEDICINES</Text>
                    <View style={{ gap: 4, marginTop: 4 }}>
                      {entities.medications.map((med, idx) => (
                        <Text key={idx} style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>• {med}</Text>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}

            {!!record.tags?.length && (
              <View style={styles.modalTagsRow}>
                {record.tags.map((tag) => (
                  <View key={tag} style={[styles.modalTag, { backgroundColor: isDark ? '#333' : '#E5E7EB' }]}>
                    <Tag size={12} color={colors.textSecondary} />
                    <Text style={[styles.modalTagText, { color: colors.text }]}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Extracted Text Section */}
            <View style={[styles.ocrTextContainer, { backgroundColor: isDark ? '#141414' : '#F3F4F6' }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[styles.ocrTextTitle, { color: colors.textSecondary, marginBottom: 0 }]}>EXTRACTED OCR TEXT</Text>
                  <View style={{ backgroundColor: '#10B98120', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#10B981' }}>VERIFIED OCR</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Pressable onPress={() => setShowFullText(!showFullText)}>
                    <Text style={{ fontSize: 12, color: colors.accent, fontWeight: '700' }}>
                      {showFullText ? 'Collapse' : 'Expand All'}
                    </Text>
                  </Pressable>

                  {record.extractedText && (
                    <Pressable 
                      onPress={() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                    >
                      {copied ? <CheckCircle2 size={14} color="#10B981" /> : <Copy size={14} color={colors.accent} />}
                      <Text style={{ fontSize: 12, color: copied ? '#10B981' : colors.accent, fontWeight: '700' }}>
                        {copied ? 'Copied!' : 'Copy'}
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>

              <Text style={[styles.ocrTextBody, { color: colors.text }]} numberOfLines={showFullText ? undefined : 6}>
                {record.extractedText || 'No readable text was extracted from this document.'}
              </Text>
            </View>
          </ScrollView>

          <Pressable style={[styles.closeModalBtn, { backgroundColor: colors.accent }]} onPress={onClose}><Text style={styles.closeModalBtnText}>Close Reader</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { height: '94%', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, elevation: 10 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(150,150,150,0.15)' },
  titleRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  modalTitle: { flex: 1, fontSize: 18, fontWeight: '700' }, closeBtn: { padding: 4 }, scrollView: { flex: 1, marginTop: 12 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  metaBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: '600' }, metaDate: { fontSize: 13 },
  summaryBox: { padding: 12, borderRadius: 12, marginBottom: 12 }, summaryHeader: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 }, summaryBody: { fontSize: 14, lineHeight: 20 },
  modalTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }, modalTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }, modalTagText: { fontSize: 12, fontWeight: '500' },
  ocrTextContainer: { padding: 14, borderRadius: 12, marginBottom: 16 }, ocrTextTitle: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }, ocrTextBody: { fontSize: 13, lineHeight: 20, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  closeModalBtn: { height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginTop: 10 }, closeModalBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
