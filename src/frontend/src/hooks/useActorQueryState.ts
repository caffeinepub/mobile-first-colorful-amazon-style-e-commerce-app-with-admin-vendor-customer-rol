import { useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from './useInternetIdentity';
import { useSyncExternalStore } from 'react';

/**
 * Lightweight hook that reads the React Query cache for the actor query
 * and subscribes to changes without re-running the actor creation logic.
 * 
 * This allows components to check if actor initialization has failed
 * without triggering additional actor creation attempts.
 */
export function useActorQueryState() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const queryKey = ['actor', identity?.getPrincipal().toString()];

  // Subscribe to query cache changes
  const subscribe = (callback: () => void) => {
    const unsubscribe = queryClient.getQueryCache().subscribe(callback);
    return unsubscribe;
  };

  const getSnapshot = () => {
    const query = queryClient.getQueryState(queryKey);
    return {
      status: query?.status || 'pending',
      error: query?.error || null,
      data: query?.data || null,
      isFetching: query?.fetchStatus === 'fetching',
    };
  };

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
