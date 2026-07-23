import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, Platform } from 'react-native';
import { Sparkles, X, Tag } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { MedicalRecord } from '@/hooks/useRecordsStore';

interface DocumentReaderModalProps {
  record: MedicalRecord | null;
  visible: boolean;
  onClose: () => void;
}

export default function DocumentReaderModal({ record, visible, onClose }: DocumentReaderModalProps) {
  const { colors, isDark } = useTheme();

  if (!record) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
              <Sparkles size={20} color={colors.accent} />
              <Text style={[styles.modalTitle, { color: colors.text }]} numberOfLines={1}>
                {record.title}
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView style={{ flex: 1, marginTop: 12 }} showsVerticalScrollIndicator={false}>
            <View style={styles.metaRow}>
              <Text style={[styles.metaBadge, { backgroundColor: colors.accent + '20', color: colors.accent }]}>
                {record.category}
              </Text>
              <Text style={[styles.metaDate, { color: colors.textSecondary }]}>
                Uploaded: {record.date}
              </Text>
            </View>

            {record.summary && (
              <View style={[styles.summaryBox, { backgroundColor: isDark ? '#262626' : '#F9FAFB' }]}>
                <Text style={[styles.summaryHeader, { color: colors.textSecondary }]}>AI Extracted Summary</Text>
                <Text style={[styles.summaryBody, { color: colors.text }]}>{record.summary}</Text>
              </View>
            )}

            {record.tags && record.tags.length > 0 && (
              <View style={styles.modalTagsRow}>
                {record.tags.map((tag, idx) => (
                  <View key={idx} style={[styles.modalTag, { backgroundColor: isDark ? '#333' : '#E5E7EB' }]}>
                    <Tag size={12} color={colors.textSecondary} style={{ marginRight: 4 }} />
                    <Text style={[styles.modalTagText, { color: colors.text }]}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={[styles.ocrTextContainer, { backgroundColor: isDark ? '#141414' : '#F3F4F6' }]}>
              <Text style={[styles.ocrTextTitle, { color: colors.textSecondary }]}>FULL EXTRACTED TEXT (OCR)</Text>
              <Text style={[styles.ocrTextBody, { color: colors.text }]}>
                {record.extractedText || 'No text extracted from this document.'}
              </Text>
            </View>
          </ScrollView>

          <Pressable
            style={[styles.closeModalBtn, { backgroundColor: colors.accent }]}
            onPress={onClose}
          >
            <Text style={styles.closeModalBtnText}>Close Reader</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    height: '80%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150,150,150,0.15)',
  },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  closeBtn: { padding: 4 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 },
  metaBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: '600' },
  metaDate: { fontSize: 13 },
  summaryBox: { padding: 12, borderRadius: 12, marginBottom: 12 },
  summaryHeader: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  summaryBody: { fontSize: 14, lineHeight: 20 },
  modalTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  modalTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  modalTagText: { fontSize: 12, fontWeight: '500' },
  ocrTextContainer: { padding: 14, borderRadius: 12, marginBottom: 16 },
  ocrTextTitle: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  ocrTextBody: { fontSize: 13, lineHeight: 20, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  closeModalBtn: { height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  closeModalBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
