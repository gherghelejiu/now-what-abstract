// Implements IBackendProvider using the Convex SDK.
// All existing Convex call-sites live here — nowhere else.

import { ConvexClient } from 'convex/browser';
import { ConvexReactClient } from 'convex/react';
import { createAuthClient } from '@convex-dev/auth/react';
import Constants from 'expo-constants';

import type { IBackendProvider } from '../IBackendProvider';
import type { User, Device, Unsubscribe } from '../types';

// ---------------------------------------------------------------------------
// Convex-generated API — the only place these paths are referenced
// ---------------------------------------------------------------------------
// TODO: remove if switching backend provider
import { api } from '@/convex/_generated/api';

// ---------------------------------------------------------------------------
// Convex URL — read from Expo config extra or fall back to env variable
// ---------------------------------------------------------------------------
const CONVEX_URL: string =
  (Constants.expoConfig?.extra?.convexUrl as string | undefined) ??
  (process.env.EXPO_PUBLIC_CONVEX_URL as string);

if (!CONVEX_URL) {
  throw new Error(
    '[ConvexProvider] EXPO_PUBLIC_CONVEX_URL is not set. ' +
      'Add it to your environment or app.json extra.convexUrl.',
  );
}

// ---------------------------------------------------------------------------
// Shared client instances (singleton per JS context)
// ---------------------------------------------------------------------------
// TODO: remove if switching backend provider
const convexClient = new ConvexReactClient(CONVEX_URL);

// The auth client wraps the same underlying transport so we can call signIn /
// signOut without a React hook context.
// TODO: remove if switching backend provider
const { signIn: _signIn, signOut: _signOut } = createAuthClient(convexClient);

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------
export class ConvexProvider implements IBackendProvider {
  // ── Auth ──────────────────────────────────────────────────────────────────

  async signIn(strategy: string, payload?: Record<string, unknown>): Promise<unknown> {
    // TODO: remove if switching backend provider
    return _signIn(strategy as Parameters<typeof _signIn>[0], payload as Parameters<typeof _signIn>[1]);
  }

  async signOut(): Promise<void> {
    // TODO: remove if switching backend provider
    return _signOut();
  }

  // ── Users ─────────────────────────────────────────────────────────────────

  subscribeUserByFingerprint(
    fingerprint: string,
    onData: (user: User | null) => void,
  ): Unsubscribe {
    // TODO: remove if switching backend provider
    return convexClient.onUpdate(
      api.users.getUserByFingerprint,
      { fingerprint },
      (value) => onData(value as User | null),
    );
  }

  subscribeCurrentUser(
    onData: (user: User | null) => void,
  ): Unsubscribe {
    // TODO: remove if switching backend provider
    return convexClient.onUpdate(
      api.users.getCurrentUser,
      {},
      (value) => onData(value as User | null),
    );
  }

  // ── Devices ───────────────────────────────────────────────────────────────

  subscribeDeviceByFingerprint(
    fingerprint: string,
    onData: (device: Device | null | undefined) => void,
  ): Unsubscribe {
    // TODO: remove if switching backend provider
    return convexClient.onUpdate(
      api.devices.findDeviceByFingerprint,
      { fingerprint },
      (value) => {
        // Convex onUpdate delivers `undefined` only before the first result;
        // after that it is null (not found) or a document.
        onData(value as Device | null | undefined);
      },
    );
  }
}