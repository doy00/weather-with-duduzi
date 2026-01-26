import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '@/features/shared/components/GlassCard';

interface ErrorScreenProps {
  message?: string;
  detail?: string;
  onRetry?: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  message,
  detail,
  onRetry
}) => {
  const { t } = useTranslation(['errors', 'common']);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white bg-gradient-to-b from-galaxy-blue-start to-galaxy-blue-end p-6 text-center">
      <AlertCircle size={64} className="mb-6 text-white/50" />
      <p className="font-bold text-2xl mb-2">{message || t('errors:screen.errorTitle')}</p>
      <p className="opacity-70 mb-8 leading-relaxed whitespace-pre-line">{detail || t('errors:screen.errorDetail')}</p>
      {onRetry && (
        <GlassCard className="p-4">
          <button
            onClick={onRetry}
            className="px-8 py-3 font-bold flex items-center gap-2 active:scale-95 transition-all text-white"
          >
            <RefreshCw size={20} /> {t('common:button.retry')}
          </button>
        </GlassCard>
      )}
    </div>
  );
};
