import { HashRouter, Route, Routes } from 'react-router-dom';

import { Footer } from './components/Footer';
import { Nav } from './components/Nav';
import { LangProvider } from './components/LangProvider';
import AppPage from './pages/AppPage';
import Landing from './pages/Landing';
import Waitlist from './pages/Waitlist';

// HashRouter so the site works on GitHub Pages without any server setup.
export default function App() {
  return (
    <LangProvider>
      <HashRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/lista-e-pritjes" element={<Waitlist />} />
          <Route path="/aplikacioni" element={<AppPage />} />
        </Routes>
        <Footer />
      </HashRouter>
    </LangProvider>
  );
}
