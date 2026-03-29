import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '@/config/constants';

// Supabase 클라이언트 생성 (환경 변수가 없으면 null)
function createSupabaseClient(): SupabaseClient | null {
  // 환경 변수 검증
  if (
    !SUPABASE_URL ||
    !SUPABASE_PUBLISHABLE_KEY ||
    SUPABASE_URL === 'your-supabase-url' ||
    SUPABASE_PUBLISHABLE_KEY === 'your-publishable-key'
  ) {
    console.warn(
      '[Supabase] 환경 변수가 설정되지 않았습니다. Realtime 동기화가 비활성화됩니다.'
    );
    return null;
  }

  try {
    return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      realtime: {
        params: {
          eventsPerSecond: 2,
        },
      },
      auth: {
        persistSession: false,
      },
    });
  } catch (error) {
    console.error('[Supabase] 클라이언트 생성 실패:', error);
    return null;
  }
}

export const supabase = createSupabaseClient();

export function monitorRealtimeStatus(
  callback: (status: 'connected' | 'disconnected') => void
) {
  if (!supabase) {
    // Supabase가 없으면 즉시 disconnected 상태 반환
    callback('disconnected');
    return () => {};
  }

  const channel = supabase.channel('_monitor');

  channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      callback('connected');
    } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
      callback('disconnected');
    }
  });

  return () => supabase.removeChannel(channel);
}
