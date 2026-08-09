import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useTheme } from '@/hooks/useTheme';
import { GlassProvider } from '@/contexts/GlassContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isDark } = useTheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <GlassProvider>
      <BottomSheetModalProvider>
        <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="location" options={{ headerShown: false, presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="doctor/[id]" options={{ headerShown: false, presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="category/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="care/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="care/service/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="hospital/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="hospital/info" options={{ headerShown: false }} />
          <Stack.Screen name="booking/checkout" options={{ headerShown: false }} />
          <Stack.Screen name="booking/success" options={{ headerShown: false }} />
          <Stack.Screen name="packages/category/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="packages/category/planned-surgery" options={{ headerShown: false }} />
          <Stack.Screen name="packages/category/surgery" options={{ headerShown: false }} />
          <Stack.Screen name="packages/category/international" options={{ headerShown: false }} />
          <Stack.Screen name="packages/category/women" options={{ headerShown: false }} />
          <Stack.Screen name="packages/category/womens" options={{ headerShown: false }} />
          <Stack.Screen name="packages/category/men" options={{ headerShown: false }} />
          <Stack.Screen name="packages/category/mens" options={{ headerShown: false }} />
          <Stack.Screen name="packages/category/preventive" options={{ headerShown: false }} />
          <Stack.Screen name="packages/category/full-body" options={{ headerShown: false }} />
          <Stack.Screen name="packages/category/knee" options={{ headerShown: false }} />
          <Stack.Screen name="packages/category/senior" options={{ headerShown: false }} />
          <Stack.Screen name="packages/category/cardiac" options={{ headerShown: false }} />
          <Stack.Screen name="packages/category/dental" options={{ headerShown: false }} />
          <Stack.Screen name="packages/category/diabetes" options={{ headerShown: false }} />
          <Stack.Screen name="packages/category/fitness" options={{ headerShown: false }} />
          <Stack.Screen name="packages/category/ortho" options={{ headerShown: false }} />
          <Stack.Screen name="packages/category/pediatrics" options={{ headerShown: false }} />
          <Stack.Screen name="packages/category/pregnancy" options={{ headerShown: false }} />
          <Stack.Screen name="packages/category/skin" options={{ headerShown: false }} />
          <Stack.Screen name="packages/category/weight" options={{ headerShown: false }} />
          <Stack.Screen name="packages/provider/[providerId]" options={{ headerShown: false }} />
          <Stack.Screen name="packages/detail/[packageId]" options={{ headerShown: false }} />
          <Stack.Screen name="packages/checkout/[packageId]" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
        </ThemeProvider>
      </BottomSheetModalProvider>
    </GlassProvider>
    </GestureHandlerRootView>
  );
}
