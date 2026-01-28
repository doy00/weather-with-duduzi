import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LoadingScreenProps {
  message?: string;
  statusMessage?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message,
  statusMessage
}) => {
  const { t } = useTranslation('errors');

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white bg-gradient-to-b from-galaxy-blue-start to-galaxy-blue-end p-10 text-center">
      <Loader2 size={48} className="animate-spin mb-6 text-white/80" />
      <p className="font-bold text-2xl mb-2">{message || t('loading.weather')}</p>
      <p className="opacity-70 text-lg">{statusMessage || t('loading.status')}</p>
    </div>
  );
};
