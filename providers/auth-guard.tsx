import { api } from '@/convex/_generated/api';
import { getDeviceFingerprint } from '@/utils/device';
import { useAuthActions } from '@convex-dev/auth/react';
import { useQuery } from "convex/react";
import { createContext, useContext, useEffect, useState } from 'react';


type AuthGuardContextValue = {
  user: any | null;
  fingerprint: string | null;
  device: any | null | undefined;
  isReady: boolean;
}

const AuthGuardContext = createContext<AuthGuardContextValue | null>(null);

export const useAuthGuard = () => {
  const ctx = useContext(AuthGuardContext);
  if (!ctx) throw new Error('useAuthGuard must be used within AuthGuardProvider!');
  return ctx;
}

export const AuthGuardProvider = ({ children }: { children : React.ReactNode }) => {

    const { signIn } = useAuthActions();

    const [fingerprint, setFingerprint] = useState<string | null>(null);

    const device = useQuery(
        api.devices.findDeviceByFingerprint, 
        fingerprint ? { fingerprint: fingerprint } : 'skip'
    );

    const user = useQuery(
      api.users.getUserByFingerprint,
      fingerprint ? { fingerprint: fingerprint } : 'skip'
    );

    // console.log('user: ', JSON.stringify(user));


    useEffect(() => {
        console.log('root mounted.');
        const handleDeviceId = async () => {
          const fingerprint = await getDeviceFingerprint();
          console.log('setting fingerprint => ', fingerprint);
          setFingerprint(fingerprint);
          // this will trigger device query.
        }

        handleDeviceId();
    }, []);

    useEffect(() => {
        console.log('device use effect. device: ', JSON.stringify(device));
        const handleAnonymousAuth = async () => {
          if (device) {
            // no need to sign in
            // device already exists in our convex table 
            console.log('no need to sign in');
          } else if (device === null) {
            console.log('device is null, signing in...');
            // 
            const result = await signIn('anonymous', { fingerprint });
            console.log('result: ', JSON.stringify(result));
            // 
            // await storeDevice({ fingerprint: fingerprintRef.current || "todo" });
          } else {
            console.log('device is undefined.');
          }
        }
        
        handleAnonymousAuth();
    }, [device]);

    const isReady = fingerprint !== null && device !== undefined && user !== undefined;

    return <AuthGuardContext.Provider value={{
      user, fingerprint, device, isReady
    }}>
      {children}
    </AuthGuardContext.Provider>
}