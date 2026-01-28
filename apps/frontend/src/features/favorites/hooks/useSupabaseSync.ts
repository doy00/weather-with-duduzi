import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import type { FavoriteLocation } from '../types/favorite.types';
import { FAVORITES_QUERY_KEY } from '../constants';

export function useSupabaseSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!supabase) {
      console.warn('[Supabase Realtime] Client not initialized');
      return;
    }

    let channel: RealtimeChannel;
    let retryTimeout: NodeJS.Timeout;

    const setupRealtimeSubscription = async () => {
      try {
        channel = supabase
          .channel('favorites-changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'favorites',
            },
            (payload) => {
              console.log('[Supabase Realtime]', payload);

              switch (payload.eventType) {
                case 'INSERT':
                  queryClient.setQueryData<FavoriteLocation[]>(
                    FAVORITES_QUERY_KEY,
                    (old = []) => {
                      const exists = old.some((f) => f.id === payload.new.id);
                      if (exists) return old;
                      return [...old, payload.new as FavoriteLocation];
                    }
                  );
                  break;

                case 'DELETE':
                  queryClient.setQueryData<FavoriteLocation[]>(
                    FAVORITES_QUERY_KEY,
                    (old = []) => old.filter((f) => f.id !== payload.old.id)
                  );
                  break;

                case 'UPDATE':
                  queryClient.setQueryData<FavoriteLocation[]>(
                    FAVORITES_QUERY_KEY,
                    (old = []) =>
                      old.map((f) =>
                        f.id === payload.new.id ? (payload.new as FavoriteLocation) : f
                      )
                  );
                  break;
              }
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              console.log('[Supabase Realtime] Connected');
            } else if (status === 'CHANNEL_ERROR') {
              console.error('[Supabase Realtime] Connection error');
              retryTimeout = setTimeout(setupRealtimeSubscription, 5000);
            }
          });
      } catch (error) {
        console.error('[Supabase Realtime] Setup failed:', error);
        queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
      }
    };

    setupRealtimeSubscription();

    return () => {
      clearTimeout(retryTimeout);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [queryClient]);
}
