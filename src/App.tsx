import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/features/shared/components/ErrorBoundary';
import { OfflineIndicator } from '@/features/shared/components/OfflineIndicator';
import { MainPage } from '@/pages/MainPage';
import { DetailPage } from '@/pages/DetailPage';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <OfflineIndicator />
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/detail/:locationId" element={<DetailPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
