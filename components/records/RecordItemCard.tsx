import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FileText, File, Eye } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { MedicalRecord } from '@/hooks/useRecordsStore';

interface RecordItemCardProps {
  file: MedicalRecord;
  onPress: () => void;
}

export default function RecordItemCard({ file, onPress }: RecordItemCardProps) {
  const { colors, isDark } = useTheme();

  return (
    <Pressable 
      style={[
        styles.fileItem, 
        { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' }
      ]}
      onPress={onPress}
    >
      <View style={[styles.fileIcon, { backgroundColor: isDark ? '#333' : '#F5F5F5' }]}>
        {file.category === 'Prescription' ? (
          <FileText size={24} color={colors.accent} />
        ) : (
          <File size={24} color={colors.accent} />
        )}
      </View>
      <View style={styles.fileDetails}>
        <Text style={[styles.fileName, { color: colors.text }]} numberOfLines={1}>{file.title}</Text>
        <Text style={[styles.fileMeta, { color: colors.textSecondary }]} numberOfLines={1}>
          {file.date} • {file.category}
        </Text>
        {file.summary && (
          <Text style={[styles.fileSummarySnippet, { color: colors.textMuted }]} numberOfLines={1}>
            {file.summary}
          </Text>
        )}
      </View>
      <View style={styles.fileActions}>
        <Pressable style={styles.actionIcon} onPress={onPress}>
          <Eye size={20} color={colors.accent} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
    marginRight: 12,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  fileMeta: {
    fontSize: 12,
  },
  fileSummarySnippet: {
    fontSize: 12,
    marginTop: 2,
    fontStyle: 'italic',
  },
  fileActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    padding: 8,
  },
});
