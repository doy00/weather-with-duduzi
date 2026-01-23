import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  statusMessage?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "날씨를 불러오고 있습니다",
  statusMessage = "전 세계 기상 데이터를 확인 중..."
}) => (
  <div className="flex flex-col items-center justify-center h-screen text-white bg-gradient-to-b from-galaxy-blue-start to-galaxy-blue-end p-10 text-center">
    <Loader2 size={48} className="animate-spin mb-6 text-white/80" />
    <p className="font-bold text-2xl mb-2">{message}</p>
    <p className="opacity-70 text-lg">{statusMessage}</p>
  </div>
);
