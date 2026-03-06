import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthGuardProvider } from '@/providers/auth-guard';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';

// TODO: remove if switching backend provider
import { ConvexProvider, ConvexReactClient } from 'convex/react';
// TODO: remove if switching backend provider
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import * as SecureStore from 'expo-secure-store';

import backend from '../src/backend';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Reuse the single ConvexReactClient that lives inside our backend provider.
// TODO: remove if switching backend provider
const convex = (backend as any).convexClient as ConvexReactClient;

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    // TODO: remove if switching backend provider
    <ConvexProvider client={convex}>
      {/* TODO: remove if switching backend provider */}
      <ConvexAuthProvider client={convex} storage={secureStorage}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AuthGuardProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
          </AuthGuardProvider>
          <StatusBar style="auto" />
        </ThemeProvider>
      </ConvexAuthProvider>
    </ConvexProvider>
  );
}

// ─── Secure storage (required by ConvexAuthProvider) ─────────────────────────
// TODO: remove if switching backend provider
const secureStorage = {
  getItem: async (key: string) => {
    try {
      const value = await SecureStore.getItemAsync(key);
      console.log('🔵 SecureStore getItem:', key, value ? 'has value' : 'null');
      return value;
    } catch (e) {
      console.error('🔴 SecureStore getItem error:', e);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value);
      console.log('🔵 SecureStore setItem:', key, 'stored successfully');
    } catch (e) {
      console.error('🔴 SecureStore setItem error:', e);
    }
  },
  removeItem: async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key);
      console.log('🔵 SecureStore removeItem:', key, 'removed successfully');
    } catch (e) {
      console.error('🔴 SecureStore removeItem error:', e);
    }
  },
};