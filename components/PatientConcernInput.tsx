import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';

interface PatientConcernInputProps {
  concernText: string;
  setConcernText: (text: string) => void;
  colors: any;
  isDark: boolean;
}

export default function PatientConcernInput({ concernText, setConcernText, colors, isDark }: PatientConcernInputProps) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Describe your concern <Text style={{ color: '#9CA3AF', fontWeight: '400', fontSize: 13 }}>(optional)</Text>
      </Text>
      <View style={[styles.textAreaContainer, { backgroundColor: isDark ? '#1E1E1E' : '#F9FAFB', borderColor: isDark ? '#333' : '#E5E7EB' }]}>
        <TextInput
          style={[styles.textArea, { color: colors.text }]}
          placeholder="e.g. chest pain, breathlessness, high BP..."
          placeholderTextColor="#9CA3AF"
          multiline
          maxLength={200}
          value={concernText}
          onChangeText={setConcernText}
        />
        <Text style={styles.charCount}>{concernText.length}/200</Text>
      </View>
      <View style={styles.secureRow}>
        <ShieldCheck size={16} color="#6B7280" />
        <Text style={styles.secureText}>Your information is 100% confidential & secure</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 12,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderRadius: 12,
    height: 100,
    padding: 12,
    position: 'relative',
    marginBottom: 12,
  },
  textArea: {
    flex: 1,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  charCount: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    fontSize: 12,
    color: '#9CA3AF',
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secureText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
});
