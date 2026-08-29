import React from 'react';
import { StyleSheet, View } from 'react-native';

interface NativePdfViewerProps {
  uri: string;
  onError?: (error: object) => void;
}

export default function NativePdfViewer({ uri }: NativePdfViewerProps) {
  return (
    <View style={styles.webContainer}>
      {/* @ts-ignore */}
      <iframe
        src={uri}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="PDF Preview"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
});
