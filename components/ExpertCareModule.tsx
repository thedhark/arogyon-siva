import React from 'react';
import { StyleSheet, View } from 'react-native';
import ExpertBentoGrid from './expert/ExpertBentoGrid';

interface ExpertCareModuleProps {
  colors?: any;
  isDark?: boolean;
  embedded?: boolean;
  onSpecialityPress?: (speciality: string) => void;
  onNavigate?: () => void;
}

export default function ExpertCareModule({
  isDark = false,
  embedded = false,
  onSpecialityPress,
  onNavigate,
}: ExpertCareModuleProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.gridWrapper, embedded && styles.gridWrapperEmbedded]}>
        <ExpertBentoGrid
          isDark={isDark}
          onNavigate={onNavigate}
          onSelectCategory={
            onSpecialityPress
              ? (id) => {
                  if (id === 'foreign') onSpecialityPress('Cardiologist');
                  else if (id === 'opinion') onSpecialityPress('Neurologist');
                }
              : undefined
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    width: '100%',
  },
  gridWrapper: {
    paddingHorizontal: 16,
  },
  gridWrapperEmbedded: {
    paddingHorizontal: 0,
  },
});

