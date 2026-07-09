import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PracticeProvider } from './context/PracticeContext';
import { HomePage } from './pages/HomePage';
import { SetupPage } from './pages/SetupPage';
import { WeakSetupPage } from './pages/WeakSetupPage';
import { PracticePage } from './pages/PracticePage';
import { ResultsPage } from './pages/ResultsPage';
import { StatisticsPage } from './pages/StatisticsPage';

export default function App() {
  return (
    <PracticeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/setup/weak" element={<WeakSetupPage />} />
          <Route path="/setup/:type" element={<SetupPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PracticeProvider>
  );
}
