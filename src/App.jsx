import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BirthdayProvider } from './context/BirthdayContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Create from './pages/Create';
import Surprise from './pages/Surprise';
import Romantic from './pages/Romantic';

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/surprise" element={<Surprise />} />
          <Route path="/romantic" element={<Romantic />} />
          {/* Catch-all: redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </BirthdayProvider>
    </ThemeProvider>
  );
}
