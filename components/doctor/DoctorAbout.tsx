import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  doctorData: any;
  colors: any;
  isDark: boolean;
}

export default function DoctorAbout({ doctorData, colors, isDark }: Props) {
  return (
    <View style={styles.tabContent}>
      <Text style={[styles.aboutText, { color: colors.text }]}>{doctorData.about}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
  },
});
