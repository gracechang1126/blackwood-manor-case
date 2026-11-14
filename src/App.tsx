import { Route, Routes } from 'react-router-dom';
import ScreenPage from './pages/ScreenPage';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ScreenPage />} />
      <Route path="/s/:id" element={<ScreenPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
