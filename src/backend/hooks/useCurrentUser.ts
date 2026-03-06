/**
 * Drop-in replacement for:
 *   const user = useQuery(api.users.getCurrentUser);
 */

import { useEffect, useState } from 'react';
import backend from '../index';
import type { User } from '../types';

export function useCurrentUser(): User | null | undefined {
  // undefined = still loading, null = not signed in, User = signed in
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = backend.subscribeCurrentUser(
      (u) => setUser(u),
      (err) => {
        console.error('[useCurrentUser]', err);
        setUser(null);
      },
    );
    return unsubscribe;
  }, []);

  return user;
}