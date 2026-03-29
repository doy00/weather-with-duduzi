import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePWAInstall } from '@/hooks/usePWAInstall';

export function PWAInstallPrompt() {
  const { t } = useTranslation('common');
  const { isInstallable, handleInstallClick } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || dismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="glass p-4 flex items-center justify-between gap-3 shadow-lg rounded-2xl">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-white/30 flex items-center justify-center">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-sm">{t('pwa.installTitle')}</p>
            <p className="text-white/80 text-xs">{t('pwa.installDescription')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-white/30 hover:bg-white/40 rounded-lg text-white text-sm font-medium transition-colors"
          >
            {t('pwa.installButton')}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
