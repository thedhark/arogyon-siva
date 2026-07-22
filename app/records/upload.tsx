import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, UploadCloud, File, Image as ImageIcon, Camera } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useRecordsStore } from '@/hooks/useRecordsStore';

export default function UploadRecordScreen() {
  const { colors, isDark } = useTheme();
  const addRecord = useRecordsStore((state) => state.addRecord);

  const [selectedFile, setSelectedFile] = useState<{ uri: string, name: string, type: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets.length > 0) {
        setSelectedFile({
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: result.assets[0].mimeType || 'unknown',
        });
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
        result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') return;
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'images',
          quality: 0.7,
        });
      }

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedFile({
          uri: asset.uri,
          name: asset.fileName || `Image_${Date.now()}.jpg`,
          type: 'image/jpeg',
        });
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      // Guess category based on file type roughly
      const isPdf = selectedFile.type.includes('pdf') || selectedFile.name.endsWith('.pdf');
      
      addRecord({
        title: selectedFile.name.substring(0, 20) + (selectedFile.name.length > 20 ? '...' : ''),
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        category: isPdf ? 'Lab Report' : 'Prescription',
        fileUri: selectedFile.uri,
        fileName: selectedFile.name,
      });
      
      setIsUploading(false);
      router.back();
    }, 1500);
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

        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Securely store your prescriptions, lab reports, and medical bills.
            </Text>
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
                  <Text style={[styles.dropzoneText, { color: colors.accent }]}>
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
              
              <Pressable 
                style={[styles.optionCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F0F0F0' }]}
                onPress={() => handleImagePick(true)}
              >
                <Camera size={24} color={colors.accent} />
                <Text style={[styles.optionText, { color: colors.text }]}>Camera</Text>
              </Pressable>
            </Animated.View>
          )}

          <Animated.View entering={FadeInUp.delay(500)} style={styles.footer}>
            <Pressable 
              style={[
                styles.button, 
                { backgroundColor: selectedFile ? colors.accent : colors.textMuted }
              ]} 
              onPress={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>
                  Save Record
                </Text>
              )}
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  content: { flex: 1, padding: 24 },
  header: { marginBottom: 32 },
  subtitle: { fontSize: 16, lineHeight: 24, textAlign: 'center' },
  uploadArea: { marginBottom: 32 },
  dropzone: {
    height: 220,
    borderRadius: 24,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  dropzoneText: { fontSize: 18, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  dropzoneSubtext: { fontSize: 14, textAlign: 'center' },
  optionsGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  optionCard: {
    flex: 1,
    height: 100,
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
  optionText: { marginTop: 8, fontSize: 14, fontWeight: '500' },
  footer: { marginTop: 'auto', marginBottom: Platform.OS === 'ios' ? 20 : 0 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 28,
  },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' }
});
