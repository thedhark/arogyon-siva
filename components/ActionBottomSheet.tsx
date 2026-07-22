import React, { useCallback, forwardRef, useMemo, useImperativeHandle, useRef } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useTheme } from '@/hooks/useTheme';

export type ActionBottomSheetRef = {
  present: () => void;
  dismiss: () => void;
};

interface ActionBottomSheetProps {
  children: React.ReactNode;
  snapPoints?: string[];
  title?: string;
  onDismiss?: () => void;
}

export const ActionBottomSheet = forwardRef<ActionBottomSheetRef, ActionBottomSheetProps>(
  ({ children, snapPoints = ['50%', '90%'], onDismiss }, ref) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { colors, isDark } = useTheme();

    // Expose present/dismiss methods to parent
    useImperativeHandle(ref, () => ({
      present: () => {
        Keyboard.dismiss();
        bottomSheetModalRef.current?.present();
      },
      dismiss: () => {
        Keyboard.dismiss();
        bottomSheetModalRef.current?.dismiss();
      },
    }));

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        onDismiss={onDismiss}
        backgroundStyle={{
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderRadius: 24,
        }}
        handleIndicatorStyle={{
          backgroundColor: isDark ? '#555' : '#CCC',
          width: 40,
        }}
      >
        <BottomSheetView style={styles.contentContainer}>
          {children}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 24,
  },
});
