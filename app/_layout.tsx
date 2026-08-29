import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Platform, useWindowDimensions, View } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';

import { useTheme } from '@/hooks/useTheme';
import { GlassProvider } from '@/contexts/GlassContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import WebLeftSidebar from '@/components/web/WebLeftSidebar';
import WebRightSidebar from '@/components/web/WebRightSidebar';
import GlobalChatOverlay from '@/components/GlobalChatOverlay';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isDark, colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && windowWidth >= 1024;
  const chatModeProgress = useSharedValue(0);

  const handleOpenChat = () => {
    chatModeProgress.value = withTiming(1, { duration: 300 });
  };

  const handleCloseChat = () => {
    chatModeProgress.value = withTiming(0, { duration: 250 });
  };

  const [loaded, error] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GlassProvider>
        <BottomSheetModalProvider>
          <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
            <View style={{ flex: 1, backgroundColor: colors.background }}>
              {isDesktopWeb && (
                <>
                  <WebLeftSidebar onLogoPress={handleOpenChat} />
                  <WebRightSidebar />
                  <GlobalChatOverlay
                    chatModeProgress={chatModeProgress}
                    onClose={handleCloseChat}
                  />
                </>
              )}

              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: isDesktopWeb
                    ? {
                        position: 'absolute' as any,
                        left: 260,
                        right: 350,
                        top: 0,
                        bottom: 0,
                        backgroundColor: colors.background,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderLeftColor: isDark ? '#262626' : '#F0F2F5',
                        borderRightColor: isDark ? '#262626' : '#F0F2F5',
                      }
                    : { backgroundColor: colors.background },
                }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="location" options={{ headerShown: false, presentation: 'modal', animation: 'slide_from_bottom' }} />
                <Stack.Screen name="doctor/[id]" options={{ headerShown: false, presentation: 'modal', animation: 'slide_from_bottom' }} />
                <Stack.Screen name="category/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="care/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="care/service/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="top-doctors" options={{ headerShown: false }} />
                <Stack.Screen name="offers/consultations" options={{ headerShown: false }} />
                <Stack.Screen name="offers/packages" options={{ headerShown: false }} />
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
            </View>
          </ThemeProvider>
        </BottomSheetModalProvider>
      </GlassProvider>
    </GestureHandlerRootView>
  );
}
