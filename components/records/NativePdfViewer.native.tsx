import React, { useMemo } from 'react';
import { NativeModules, StyleSheet, UIManager } from 'react-native';

interface NativePdfViewerProps {
  uri: string;
  onError?: (error: object) => void;
}

export default function NativePdfViewer({ uri, onError }: NativePdfViewerProps) {
  const PdfComponent = useMemo(() => {
    try {
      if (
        !NativeModules.ReactNativeBlobUtil ||
        !UIManager.getViewManagerConfig?.('RNPDFPdfView')
      ) {
        return null;
      }
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Pdf = require('react-native-pdf');
      return Pdf?.default || Pdf;
    } catch {
      return null;
    }
  }, []);

  if (!PdfComponent) {
    return null;
  }

  return (
    <PdfComponent
      source={{ uri, cache: true }}
      style={styles.pdf}
      enableDoubleTapZoom
      minScale={1}
      maxScale={4}
      onError={onError}
    />
  );
}

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
});

