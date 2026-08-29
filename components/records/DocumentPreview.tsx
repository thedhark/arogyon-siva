import React, { useMemo, useState } from 'react';
import { Image, NativeModules, Platform, StyleSheet, Text, UIManager, View, ScrollView } from 'react-native';
import { FileWarning, Maximize2 } from 'lucide-react-native';
import { MedicalRecord } from '@/hooks/useRecordsStore';
import { useTheme } from '@/hooks/useTheme';
import NativePdfViewer from './NativePdfViewer';


function ImagePreview({ uri }: { uri: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <PreviewFallback message="This image is no longer available on the device." />;
  }

  return (
    <View style={styles.imageFrame}>
      <ScrollView
        horizontal
        maximumZoomScale={4}
        minimumZoomScale={1}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.imageScrollContainer}
        centerContent
      >
        <Image
          source={{ uri }}
          resizeMode="contain"
          style={styles.image}
          onError={() => setFailed(true)}
        />
      </ScrollView>
      <View style={styles.zoomHint}>
        <Maximize2 size={12} color="#FFF" />
        <Text style={styles.zoomHintText}>Pinch to zoom</Text>
      </View>
    </View>
  );
}

function PreviewFallback({ message }: { message: string }) {
  const { colors, isDark } = useTheme();
  return (
    <View style={[styles.fallback, { backgroundColor: isDark ? '#262626' : '#F3F4F6' }]}>
      <FileWarning size={26} color={colors.textSecondary} />
      <Text style={[styles.fallbackText, { color: colors.textSecondary }]}>{message}</Text>
    </View>
  );
}

export default function DocumentPreview({ record }: { record: MedicalRecord }) {
  const pdf = record?.fileName?.toLowerCase()?.endsWith('.pdf');
  const [pdfError, setPdfError] = useState(false);
  const canRenderPdf = useMemo(
    () =>
      Platform.OS === 'web' ||
      (!!NativeModules.ReactNativeBlobUtil && !!UIManager.getViewManagerConfig?.('RNPDFPdfView')),
    []
  );

  if (!record?.fileUri) {
    return <PreviewFallback message="This legacy record has no original file attached." />;
  }
  if (!pdf) {
    return <ImagePreview uri={record.fileUri} />;
  }
  if (!canRenderPdf || pdfError) {
    return <PreviewFallback message="PDF viewing requires the Arogyon development build with the document viewer enabled." />;
  }

  return (
    <View style={styles.pdfFrame}>
      <NativePdfViewer
        uri={record.fileUri}
        onError={() => setPdfError(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imageFrame: {
    height: 420,
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: '#111827',
    marginBottom: 12,
    position: 'relative',
  },
  imageScrollContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    minWidth: 300,
    minHeight: 380,
  },
  zoomHint: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  zoomHintText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  pdfFrame: {
    height: 420,
    overflow: 'hidden',
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: '#E5E7EB',
  },
  fallback: {
    height: 150,
    borderRadius: 16,
    marginBottom: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  fallbackText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
