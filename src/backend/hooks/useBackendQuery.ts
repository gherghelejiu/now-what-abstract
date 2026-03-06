/**
 * Generic React hook that drives a provider subscription and returns
 * the latest value as local state — a drop-in pattern to replace
 * Convex's `useQuery`.
 *
 * Usage:
 *   const tasks = useBackendQuery((cb) => backend.subscribeTasks(cb));
 */

import { useEffect, useState } from 'react';
import type { Unsubscribe } from '../types';

type SubscribeFn<T> = (
  onData: (data: T) => void,
  onError: (error: Error) => void,
) => Unsubscribe;

export function useBackendQuery<T>(
  subscribeFn: SubscribeFn<T>,
  initialValue: T,
): T {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const unsubscribe = subscribeFn(setValue, (err) => {
      console.error('[useBackendQuery]', err);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
}