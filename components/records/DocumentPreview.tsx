import React, { Suspense, useMemo, useState } from 'react';
import { Image, Platform, StyleSheet, Text, UIManager, View } from 'react-native';
import { FileWarning, Maximize2 } from 'lucide-react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { MedicalRecord } from '@/hooks/useRecordsStore';
import { useTheme } from '@/hooks/useTheme';

const NativePdf = React.lazy(() => import('react-native-pdf'));
const MAX_SCALE = 4;

function ImagePreview({ uri }: { uri: string }) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const [failed, setFailed] = useState(false);
  const pinch = Gesture.Pinch().onUpdate((event) => {
    scale.value = Math.max(1, Math.min(MAX_SCALE, savedScale.value * event.scale));
  }).onEnd(() => { savedScale.value = scale.value; });
  const pan = Gesture.Pan().onUpdate((event) => {
    if (scale.value > 1) {
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    }
  }).onEnd(() => {
    savedTranslateX.value = translateX.value;
    savedTranslateY.value = translateY.value;
  });
  const imageStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }] }));
  const gesture = Gesture.Simultaneous(pinch, pan);

  if (failed) return <PreviewFallback message="This image is no longer available on the device." />;
  return <GestureDetector gesture={gesture}><View style={styles.imageFrame}>
    <Animated.View style={[styles.imageContainer, imageStyle]}>
      <Image source={{ uri }} resizeMode="contain" style={styles.image} onError={() => setFailed(true)} />
    </Animated.View>
    <View style={styles.zoomHint}><Maximize2 size={12} color="#FFF" /><Text style={styles.zoomHintText}>Pinch to zoom</Text></View>
  </View></GestureDetector>;
}

function PreviewFallback({ message }: { message: string }) {
  const { colors, isDark } = useTheme();
  return <View style={[styles.fallback, { backgroundColor: isDark ? '#262626' : '#F3F4F6' }]}>
    <FileWarning size={26} color={colors.textSecondary} /><Text style={[styles.fallbackText, { color: colors.textSecondary }]}>{message}</Text>
  </View>;
}

export default function DocumentPreview({ record }: { record: MedicalRecord }) {
  const pdf = record.fileName.toLowerCase().endsWith('.pdf');
  const [pdfError, setPdfError] = useState(false);
  const canRenderPdf = useMemo(() => Platform.OS !== 'web' && !!UIManager.getViewManagerConfig?.('RNPDFPdfView'), []);

  if (!record.fileUri) return <PreviewFallback message="This legacy record has no original file attached." />;
  if (!pdf) return <ImagePreview uri={record.fileUri} />;
  if (!canRenderPdf || pdfError) return <PreviewFallback message="PDF viewing requires the Arogyon development build with the document viewer enabled." />;

  return <View style={styles.pdfFrame}>
    <Suspense fallback={<Text style={styles.loadingText}>Loading PDF…</Text>}>
      <NativePdf source={{ uri: record.fileUri, cache: true }} style={styles.pdf} enableDoubleTapZoom minScale={1} maxScale={4} onError={() => setPdfError(true)} />
    </Suspense>
  </View>;
}

const styles = StyleSheet.create({
  imageFrame: { height: 420, overflow: 'hidden', borderRadius: 16, backgroundColor: '#111827', marginBottom: 12 }, imageContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' }, image: { width: '100%', height: '100%' },
  zoomHint: { position: 'absolute', right: 10, bottom: 10, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.65)' }, zoomHintText: { color: '#FFF', fontSize: 11, fontWeight: '600' },
  pdfFrame: { height: 420, overflow: 'hidden', borderRadius: 16, marginBottom: 12, backgroundColor: '#E5E7EB' }, pdf: { flex: 1, backgroundColor: '#E5E7EB' }, loadingText: { padding: 16, textAlign: 'center' },
  fallback: { height: 150, borderRadius: 16, marginBottom: 12, padding: 20, alignItems: 'center', justifyContent: 'center', gap: 8 }, fallbackText: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
});
