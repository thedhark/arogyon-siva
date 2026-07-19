import React from 'react';
import { Switch, SwitchProps, Platform } from 'react-native';

interface PremiumSwitchProps extends SwitchProps {
  // Add any custom props here if needed
}

/**
 * A wrapper around the native React Native Switch.
 * On iOS, this directly calls the native UISwitch API, which automatically
 * includes all the premium HIG micro-interactions (squash & stretch, gestures, 
 * shadows) natively built into iOS by Apple.
 */
export function PremiumSwitch(props: PremiumSwitchProps) {
  return (
    <Switch
      trackColor={{ false: '#E9E9EA', true: '#34C759' }}
      ios_backgroundColor="#E9E9EA"
      {...props}
    />
  );
}
