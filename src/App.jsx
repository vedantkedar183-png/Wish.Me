import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BirthdayProvider } from './context/BirthdayContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Create from './pages/Create';
import Surprise from './pages/Surprise';
import Romantic from './pages/Romantic';
import RomanticCreate from './pages/RomanticCreate';

/**
 * Root application component.
 * Wraps all routes in ThemeProvider (dark/light mode) and
 * BirthdayProvider so any component can access birthday data.
 */
export default function App() {
  return (
    <ThemeProvider>
    <BirthdayProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/surprise" element={<Surprise />} />
            <Route path="/romantic" element={<Romantic />} />
            <Route path="/romantic/create" element={<RomanticCreate />} />
            {/* Catch-all: redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </BirthdayProvider>
    </ThemeProvider>
  );
}
