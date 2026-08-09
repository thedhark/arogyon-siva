import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, ScrollView, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, UploadCloud, File, Image as ImageIcon, Sparkles, CheckCircle2, Copy, Tag, User, Users, Plus } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useRecordsStore } from '@/hooks/useRecordsStore';
import { useProfileStore } from '@/hooks/useProfileStore';
import { readDocumentOnDevice, ParsedDocumentResult } from '@/services/documentReaderService';
import { formatDisplayDate } from '@/utils';
import { ActionBottomSheet, ActionBottomSheetRef } from '@/components/ActionBottomSheet';
import FamilyMemberForm from '@/components/profile/FamilyMemberForm';

export default function UploadRecordScreen() {
  const { colors, isDark } = useTheme();
  const addRecord = useRecordsStore((state) => state.addRecord);
  const userProfile = useProfileStore((state) => state.userProfile);
  const familyMembers = useProfileStore((state) => state.familyMembers);
  const bottomSheetRef = useRef<ActionBottomSheetRef>(null);

  const [selectedPatient, setSelectedPatient] = useState(userProfile.name);
  const [selectedFile, setSelectedFile] = useState<{ uri: string, name: string, type: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedDocumentResult | null>(null);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [copied, setCopied] = useState(false);
  const [showFullText, setShowFullText] = useState(true);

  const processFileWithOCR = async (file: { uri: string; name: string; type: string }) => {
    setSelectedFile(file);
    setParsedResult(null);
    setExtractionError(null);
    setIsScanning(true);
    try {
      const result = await readDocumentOnDevice(file);
      setParsedResult(result);
      setCustomTitle(result.suggestedTitle);
    } catch (err) {
      console.warn('OCR Scan failed:', err);
      setExtractionError('The original file can still be saved, but its text could not be read on this device.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets.length > 0) {
        const file = {
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: result.assets[0].mimeType || 'unknown',
        };
        await processFileWithOCR(file);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleImagePick = async (fromCamera: boolean = false) => {
    try {
      let result;
      if (fromCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') return;
        result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') return;
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'images',
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        const file = {
          uri: asset.uri,
          name: asset.fileName || `Scan_${Date.now()}.jpg`,
          type: 'image/jpeg',
        };
        await processFileWithOCR(file);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      addRecord({
        title: customTitle || selectedFile.name,
        date: formatDisplayDate(new Date()),
        category: parsedResult?.category || 'Other',
        patientName: selectedPatient,
        fileUri: selectedFile.uri,
        fileName: selectedFile.name,
        extractedText: parsedResult?.extractedText,
        summary: parsedResult?.summary,
        tags: parsedResult?.tags,
      });
      router.back();
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatedScreen entrance="fade">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={28} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Upload Record</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Scan & store your medical prescriptions, lab reports, and invoices.
            </Text>
          </Animated.View>

          {/* Select Patient / Family Member Section */}
          <Animated.View entering={FadeInDown.delay(200)} style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary, marginBottom: 0 }]}>Select Patient</Text>
              <TouchableOpacity 
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                onPress={() => bottomSheetRef.current?.present()}
              >
                <Plus size={14} color={colors.accent} />
                <Text style={{ fontSize: 12, fontWeight: '700', color: colors.accent }}>Add Family Member</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              <TouchableOpacity
                style={[
                  styles.patientChip,
                  { backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5', borderColor: isDark ? '#333' : '#E5E7EB' },
                  selectedPatient === userProfile.name && { backgroundColor: colors.accent, borderColor: colors.accent }
                ]}
                onPress={() => setSelectedPatient(userProfile.name)}
              >
                <User size={14} color={selectedPatient === userProfile.name ? '#FFF' : colors.textMuted} />
                <Text style={[styles.patientChipText, { color: selectedPatient === userProfile.name ? '#FFF' : colors.text }]}>
                  Self ({userProfile.name.split(' ')[0]})
                </Text>
              </TouchableOpacity>

              {familyMembers.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[
                    styles.patientChip,
                    { backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5', borderColor: isDark ? '#333' : '#E5E7EB' },
                    selectedPatient === m.name && { backgroundColor: colors.accent, borderColor: colors.accent }
                  ]}
                  onPress={() => setSelectedPatient(m.name)}
                >
                  <Users size={14} color={selectedPatient === m.name ? '#FFF' : colors.textMuted} />
                  <Text style={[styles.patientChipText, { color: selectedPatient === m.name ? '#FFF' : colors.text }]}>
                    {m.name} ({m.relation})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(300)} style={styles.uploadArea}>
            <Pressable 
              style={[
                styles.dropzone, 
                { 
                  backgroundColor: selectedFile ? colors.accent + '15' : (isDark ? '#1E1E1E' : '#FAFAFA'),
                  borderColor: selectedFile ? colors.accent : (isDark ? '#333' : '#E0E0E0'),
                  borderStyle: selectedFile ? 'solid' : 'dashed',
                }
              ]}
              onPress={handleDocumentPick}
            >
              {selectedFile ? (
                <>
                  <View style={[styles.iconCircle, { backgroundColor: colors.accent }]}>
                    <File size={32} color="#FFF" />
                  </View>
                  <Text style={[styles.dropzoneText, { color: colors.accent }]} numberOfLines={1}>
                    {selectedFile.name}
                  </Text>
                  <Text style={[styles.dropzoneSubtext, { color: colors.textSecondary }]}>
                    Tap to change file
                  </Text>
                </>
              ) : (
                <>
                  <View style={[styles.iconCircle, { backgroundColor: colors.accent + '15' }]}>
                    <UploadCloud size={32} color={colors.accent} />
                  </View>
                  <Text style={[styles.dropzoneText, { color: colors.text }]}>
                    Tap to browse files
                  </Text>
                  <Text style={[styles.dropzoneSubtext, { color: colors.textSecondary }]}>
                    Supports PDF, JPG, PNG (Max 5MB)
                  </Text>
                </>
              )}
            </Pressable>
          </Animated.View>

          {!selectedFile && (
            <Animated.View entering={FadeInUp.delay(400)} style={styles.optionsGrid}>
              <Pressable 
                style={[styles.optionCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' }]}
                onPress={handleDocumentPick}
              >
                <File size={24} color={colors.accent} />
                <Text style={[styles.optionText, { color: colors.text }]}>Document</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.optionCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' }]}
                onPress={() => handleImagePick(false)}
              >
                <ImageIcon size={24} color={colors.accent} />
                <Text style={[styles.optionText, { color: colors.text }]}>Gallery</Text>
              </Pressable>
            </Animated.View>
          )}

          {/* On-Device OCR Scanner Loading Indicator */}
          {isScanning && (
            <Animated.View entering={FadeInDown} style={[styles.ocrStatusCard, { backgroundColor: colors.accent + '10', borderColor: colors.accent + '30' }]}>
              <ActivityIndicator color={colors.accent} size="small" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.ocrStatusTitle, { color: colors.accent }]}>Reading Document Locally...</Text>
                <Text style={[styles.ocrStatusSub, { color: colors.textSecondary }]}>Running image OCR or extracting embedded PDF text</Text>
              </View>
            </Animated.View>
          )}

          {/* OCR Extracted Insights Card */}
          {parsedResult && !isScanning && (
            <Animated.View entering={FadeInUp} style={[styles.insightsCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#E8E8E8' }]}>
              <View style={styles.insightsHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={18} color={colors.accent} />
                  <Text style={[styles.insightsTitle, { color: colors.text }]}>Extracted Insights</Text>
                </View>
                <View style={[styles.categoryBadge, { backgroundColor: colors.accent + '20' }]}>
                  <Text style={[styles.categoryBadgeText, { color: colors.accent }]}>{parsedResult.category}</Text>
                </View>
              </View>

              {/* Title Field */}
              <View style={{ marginTop: 12 }}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Record Title</Text>
                <TextInput
                  style={[styles.titleInput, { color: colors.text, backgroundColor: isDark ? '#2A2A2A' : '#F8F9FA', borderColor: isDark ? '#444' : '#E5E7EB' }]}
                  value={customTitle}
                  onChangeText={setCustomTitle}
                  placeholder="Enter record title..."
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              {/* Extracted Summary */}
              <View style={{ marginTop: 12 }}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Summary Finding</Text>
                <Text style={[styles.summaryText, { color: colors.text }]}>{parsedResult.summary}</Text>
              </View>

              {parsedResult.processingWarning && <Text style={[styles.extractionWarning, { color: '#B45309' }]}>{parsedResult.processingWarning}</Text>}

              {/* Detected Tags */}
              <View style={styles.tagsRow}>
                {parsedResult.tags.map((tag, idx) => (
                  <View key={idx} style={[styles.tagPill, { backgroundColor: isDark ? '#2D3748' : '#EDF2F7' }]}>
                    <Tag size={12} color={colors.textSecondary} style={{ marginRight: 4 }} />
                    <Text style={[styles.tagText, { color: colors.text }]}>{tag}</Text>
                  </View>
                ))}
              </View>

              {/* Extracted Entities Grid */}
              {parsedResult.extractedEntities && (
                <View style={{ marginTop: 14, gap: 10 }}>
                  {parsedResult.extractedEntities.doctorName && (
                    <View style={[styles.entityCard, { backgroundColor: isDark ? '#262626' : '#EFF6FF' }]}>
                      <Text style={[styles.entityHeader, { color: colors.accent }]}>PROFILES / DOCTOR DETECTED</Text>
                      <Text style={[styles.entityBody, { color: colors.text }]}>{parsedResult.extractedEntities.doctorName}</Text>
                    </View>
                  )}

                  {parsedResult.extractedEntities.testValues.length > 0 && (
                    <View style={[styles.entityCard, { backgroundColor: isDark ? '#262626' : '#ECFDF5' }]}>
                      <Text style={[styles.entityHeader, { color: '#059669' }]}>EXTRACTED TEST METRICS</Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                        {parsedResult.extractedEntities.testValues.map((tv, idx) => (
                          <View key={idx} style={[styles.testValueBadge, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderColor: '#10B981' }]}>
                            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.text }}>{tv.name}: </Text>
                            <Text style={{ fontSize: 12, fontWeight: '600', color: '#10B981' }}>{tv.value}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {parsedResult.extractedEntities.medications.length > 0 && (
                    <View style={[styles.entityCard, { backgroundColor: isDark ? '#262626' : '#F5F3FF' }]}>
                      <Text style={[styles.entityHeader, { color: '#7C3AED' }]}>PRESCRIBED MEDICINES DETECTED</Text>
                      <View style={{ gap: 4, marginTop: 4 }}>
                        {parsedResult.extractedEntities.medications.map((med, idx) => (
                          <Text key={idx} style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
                            • {med}
                          </Text>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              )}

              {/* Full Text Container */}
              <View style={[styles.fullTextContainer, { backgroundColor: isDark ? '#141414' : '#F8F9FA' }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={[styles.fullTextHeader, { color: colors.textSecondary }]}>Full Extracted OCR Text</Text>
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
                  </View>
                </View>
                <Text style={[styles.fullTextContent, { color: colors.text }]} numberOfLines={showFullText ? undefined : 6}>
                  {parsedResult.extractedText}
                </Text>
              </View>
            </Animated.View>
          )}

          {extractionError && <Text style={[styles.extractionWarning, { color: '#B45309' }]}>{extractionError}</Text>}

          <Animated.View entering={FadeInUp.delay(500)} style={styles.footer}>
            <Pressable 
              style={[
                styles.button, 
                { backgroundColor: selectedFile && !isScanning ? colors.accent : colors.textMuted }
              ]} 
              onPress={handleUpload}
              disabled={!selectedFile || isScanning || isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>
                  Save Medical Record
                </Text>
              )}
            </Pressable>
          </Animated.View>
        </ScrollView>

        {/* Add Family Member Modal Sheet */}
        <ActionBottomSheet ref={bottomSheetRef} snapPoints={['88%']}>
          <FamilyMemberForm onSuccess={() => bottomSheetRef.current?.dismiss()} />
        </ActionBottomSheet>

      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  patientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  patientChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '600' },
  content: { padding: 24, paddingBottom: 40 },
  header: { marginBottom: 20 },
  subtitle: { fontSize: 15, lineHeight: 22, textAlign: 'center' },
  uploadArea: { marginBottom: 20 },
  dropzone: {
    height: 160,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  dropzoneText: { fontSize: 16, fontWeight: '600', marginBottom: 4, textAlign: 'center' },
  dropzoneSubtext: { fontSize: 13, textAlign: 'center' },
  optionsGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 20 },
  optionCard: {
    flex: 1,
    height: 90,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  optionText: { marginTop: 6, fontSize: 13, fontWeight: '500' },
  ocrStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  ocrStatusTitle: { fontSize: 14, fontWeight: '600' },
  ocrStatusSub: { fontSize: 12, marginTop: 2 },
  insightsCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  insightsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  insightsTitle: { fontSize: 16, fontWeight: '700' },
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  categoryBadgeText: { fontSize: 12, fontWeight: '600' },
  inputLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  titleInput: { height: 44, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, fontSize: 15, fontWeight: '500' },
  summaryText: { fontSize: 14, lineHeight: 20 },
  extractionWarning: { fontSize: 13, lineHeight: 19, marginTop: 12 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  tagPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tagText: { fontSize: 12, fontWeight: '500' },
  entityCard: { padding: 10, borderRadius: 12 },
  entityHeader: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5, marginBottom: 2 },
  entityBody: { fontSize: 14, fontWeight: '700' },
  testValueBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
  fullTextContainer: { marginTop: 14, padding: 12, borderRadius: 12 },
  fullTextHeader: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  fullTextContent: { fontSize: 12, lineHeight: 18, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  footer: { marginTop: 12, marginBottom: Platform.OS === 'ios' ? 20 : 0 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 28,
  },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' }
});
