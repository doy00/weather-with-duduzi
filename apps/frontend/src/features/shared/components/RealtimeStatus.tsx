import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { monitorRealtimeStatus } from '@/lib/supabaseClient';

export function RealtimeStatus() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = monitorRealtimeStatus((status) => {
      setIsConnected(status === 'connected');
    });

    return unsubscribe;
  }, []);

  if (isConnected) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
      <WifiOff size={16} />
      <span className="text-sm font-medium">실시간 동기화 연결 끊김</span>
    </div>
  );
}
