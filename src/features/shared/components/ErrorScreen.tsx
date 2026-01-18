import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface ErrorScreenProps {
  message?: string;
  detail?: string;
  onRetry?: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  message = "날씨 데이터를 가져올 수 없습니다.",
  detail = "API 키가 아직 활성화되지 않았거나,\n네트워크 연결 상태가 불안정합니다.",
  onRetry
}) => (
  <div className="flex flex-col items-center justify-center h-screen text-white bg-gradient-to-b from-galaxy-blue-start to-galaxy-blue-end p-6 text-center">
    <AlertCircle size={64} className="mb-6 text-white/50" />
    <p className="font-bold text-2xl mb-2">{message}</p>
    <p className="opacity-70 mb-8 leading-relaxed whitespace-pre-line">{detail}</p>
    {onRetry && (
      <GlassCard className="p-4">
        <button
          onClick={onRetry}
          className="px-8 py-3 font-bold flex items-center gap-2 active:scale-95 transition-all text-white"
        >
          <RefreshCw size={20} /> 다시 시도
        </button>
      </GlassCard>
    )}
  </div>
);
