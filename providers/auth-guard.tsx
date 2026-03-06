import { getDeviceFingerprint } from '@/utils/device';
import { createContext, useContext, useEffect, useState } from 'react';

import backend from '../src/backend';
import type { User, Device } from '../src/backend/types';

type AuthGuardContextValue = {
  user: User | null;
  fingerprint: string | null;
  device: Device | null | undefined;
  isReady: boolean;
};

const AuthGuardContext = createContext<AuthGuardContextValue | null>(null);

export const useAuthGuard = () => {
  const ctx = useContext(AuthGuardContext);
  if (!ctx) throw new Error('useAuthGuard must be used within AuthGuardProvider!');
  return ctx;
};

export const AuthGuardProvider = ({ children }: { children: React.ReactNode }) => {
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  // `undefined` = still loading; `null` = not found; Device = found
  const [device, setDevice] = useState<Device | null | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);

  // ── Initialise fingerprint once on mount ──────────────────────────────────
  useEffect(() => {
    console.log('root mounted.');
    const handleDeviceId = async () => {
      const fp = await getDeviceFingerprint();
      console.log('setting fingerprint => ', fp);
      setFingerprint(fp);
    };

    handleDeviceId();
  }, []);

  // ── Subscribe to device record whenever fingerprint is available ──────────
  useEffect(() => {
    if (!fingerprint) return;

    const unsubscribe = backend.subscribeDeviceByFingerprint(fingerprint, (value) => {
      setDevice(value);
    });

    return unsubscribe;
  }, [fingerprint]);

  // ── Subscribe to user record whenever fingerprint is available ────────────
  useEffect(() => {
    if (!fingerprint) return;

    const unsubscribe = backend.subscribeUserByFingerprint(fingerprint, (value) => {
      setUser(value);
    });

    return unsubscribe;
  }, [fingerprint]);

  // ── Anonymous auth when device query resolves to null (new device) ────────
  useEffect(() => {
    console.log('device use effect. device: ', JSON.stringify(device));

    const handleAnonymousAuth = async () => {
      if (device) {
        // Device already exists in our table — no need to sign in
        console.log('no need to sign in');
      } else if (device === null) {
        console.log('device is null, signing in...');
        const result = await backend.signIn('anonymous', {
          fingerprint: fingerprint ?? undefined,
        });
        console.log('result: ', JSON.stringify(result));
      } else {
        console.log('device is undefined.');
      }
    };

    handleAnonymousAuth();
  }, [device]);

  const isReady = fingerprint !== null && device !== undefined && user !== undefined;

  return (
    <AuthGuardContext.Provider value={{ user, fingerprint, device, isReady }}>
      {children}
    </AuthGuardContext.Provider>
  );
};