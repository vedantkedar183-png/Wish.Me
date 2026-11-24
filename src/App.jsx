import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BirthdayProvider } from './context/BirthdayContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';

// The heavy story experiences are loaded only when their route is opened.
// This keeps the landing page (and the first tap on a phone) fast.
const Create = lazy(() => import('./pages/Create'));
const Surprise = lazy(() => import('./pages/Surprise'));
const Romantic = lazy(() => import('./pages/Romantic'));
const RomanticCreate = lazy(() => import('./pages/RomanticCreate'));
const Rani = lazy(() => import('./pages/Rani'));
const RaniStory = lazy(() => import('./pages/RaniStory'));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#06030d] text-[#f5d488]">
      <div className="text-center">
        <div className="mb-3 text-3xl" aria-hidden="true">
          ✦
        </div>
        <p className="text-sm tracking-[0.3em] uppercase opacity-70">Opening…</p>
      </div>
    </div>
  );
}

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
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<Create />} />
                <Route path="/surprise" element={<Surprise />} />
                <Route path="/romantic" element={<Romantic />} />
                <Route path="/romantic/create" element={<RomanticCreate />} />
                <Route path="/rani" element={<Rani />} />
                <Route path="/rani-story" element={<RaniStory />} />
                {/* Catch-all: redirect unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </BirthdayProvider>
    </ThemeProvider>
  );
}
