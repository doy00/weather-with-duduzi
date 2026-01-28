import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function OfflineIndicator() {
  const { t } = useTranslation('errors');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="glass p-3 flex items-center gap-3 shadow-lg rounded-2xl">
        <WifiOff className="w-5 h-5 text-white" />
        <div className="flex-1">
          <p className="text-white font-medium text-sm">{t('screen.offline')}</p>
          <p className="text-white/80 text-xs">{t('screen.offlineDetail')}</p>
        </div>
      </div>
    </div>
  );
}
