import React from 'react';
import { StyleSheet, View } from 'react-native';
import SummerCareBanner from './expert/SummerCareBanner';
import ExpertBentoGrid from './expert/ExpertBentoGrid';
import ExpertFooter from './expert/ExpertFooter';

interface ExpertCareModuleProps {
  colors?: any;
  isDark?: boolean;
  onSpecialityPress?: (speciality: string) => void;
}

export default function ExpertCareModule({
  isDark = false,
  onSpecialityPress,
}: ExpertCareModuleProps) {
  return (
    <View style={styles.container}>
      {/* Edge-to-Edge Status-Bar Merged Banner */}
      <SummerCareBanner isDark={isDark} />

      {/* Framed Padded Bento Grid below banner */}
      <View style={styles.gridWrapper}>
        <ExpertBentoGrid
          isDark={isDark}
          onSelectCategory={
            onSpecialityPress
              ? (id) => {
                  if (id === 'pregnancy') onSpecialityPress('Gynaecologist');
                  else if (id === 'surgery') onSpecialityPress('Sports Physiotherapist');
                  else if (id === 'foreign') onSpecialityPress('Cardiologist');
                  else if (id === 'opinion') onSpecialityPress('Neurologist');
                }
              : undefined
          }
        />

        {/* Arogyan Brand Footer */}
        <ExpertFooter isDark={isDark} />
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
});

