import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/features/shared/components/ErrorBoundary';
import { OfflineIndicator } from '@/features/shared/components/OfflineIndicator';
import { RealtimeStatus } from '@/features/shared/components/RealtimeStatus';
import { ToastContainer } from '@/features/shared/components/Toast';
import { LoadingScreen } from '@/features/shared/components/LoadingScreen';
import { useSupabaseSync } from '@/features/favorites/hooks/useSupabaseSync';

const MainPage = lazy(() => import('@/pages/MainPage').then(m => ({ default: m.MainPage })));
const DetailPage = lazy(() => import('@/pages/DetailPage').then(m => ({ default: m.DetailPage })));

const App: React.FC = () => {
  useSupabaseSync();

  return (
    <ErrorBoundary>
      <OfflineIndicator />
      <RealtimeStatus />
      <ToastContainer />
      <Router>
        <Suspense fallback={<LoadingScreen statusMessage="페이지를 불러오는 중..." />}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/detail/:locationId" element={<DetailPage />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
