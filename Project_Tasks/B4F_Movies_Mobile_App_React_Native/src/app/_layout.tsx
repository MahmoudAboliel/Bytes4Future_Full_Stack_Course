import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { Colors } from '@/constants/theme';
import { I18nProvider } from '@/i18n';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <I18nProvider>
      <ThemeProvider value={DarkTheme}>
        <AnimatedSplashOverlay />
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: Colors.dark.backgroundElement },
            headerTintColor: Colors.dark.text,
            headerTitleStyle: { color: Colors.dark.text, fontWeight: '600' },
            contentStyle: { backgroundColor: Colors.dark.background },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="movie/[id]" options={{ title: '' }} />
          <Stack.Screen name="person/[id]" options={{ title: '' }} />
        </Stack>
      </ThemeProvider>
    </I18nProvider>
  );
}
