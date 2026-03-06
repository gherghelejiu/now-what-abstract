// Provider-agnostic interface — no convex/* imports allowed here

import type { User, Device, Unsubscribe } from './types';

export interface IBackendProvider {
  // ---------------------------------------------------------------------------
  // Auth
  // ---------------------------------------------------------------------------

  /**
   * Sign in using a named strategy and an optional payload.
   * Maps to convex-dev/auth `signIn(strategy, payload)`.
   */
  signIn(strategy: string, payload?: Record<string, unknown>): Promise<unknown>;

  /**
   * Sign out the current session.
   */
  signOut(): Promise<void>;

  // ---------------------------------------------------------------------------
  // Users
  // ---------------------------------------------------------------------------

  /**
   * Subscribe to the user record matching the given fingerprint.
   * Calls `onData` whenever the value changes; returns an unsubscribe function.
   */
  subscribeUserByFingerprint(
    fingerprint: string,
    onData: (user: User | null) => void,
  ): Unsubscribe;

  /**
   * Subscribe to the currently-authenticated user record.
   */
  subscribeCurrentUser(
    onData: (user: User | null) => void,
  ): Unsubscribe;

  // ---------------------------------------------------------------------------
  // Devices
  // ---------------------------------------------------------------------------

  /**
   * Subscribe to the device record matching the given fingerprint.
   * `onData` receives `undefined` while the query is loading, `null` when no
   * record exists, or the `Device` object once found.
   */
  subscribeDeviceByFingerprint(
    fingerprint: string,
    onData: (device: Device | null | undefined) => void,
  ): Unsubscribe;
}