import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AnimatedLayout from './components/AnimatedLayout';

import Home from './pages/Home';
import About from './pages/About';
import Primary1 from './pages/Primary1';
import ArabicP1 from './pages/ArabicP1';
import MathP1 from './pages/MathP1';
import FrenchP1 from './pages/FrenchP1';
import ScienceP1 from './pages/ScienceP1';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route element={<AnimatedLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/index.html" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/about.html" element={<About />} />
          <Route path="/primary1" element={<Primary1 />} />
          <Route path="/primary1.html" element={<Primary1 />} />
          <Route path="/arabic_p1" element={<ArabicP1 />} />
          <Route path="/arabic_p1.html" element={<ArabicP1 />} />
          <Route path="/math_p1" element={<MathP1 />} />
          <Route path="/math_p1.html" element={<MathP1 />} />
          <Route path="/french_p1" element={<FrenchP1 />} />
          <Route path="/french_p1.html" element={<FrenchP1 />} />
          <Route path="/science_p1" element={<ScienceP1 />} />
          <Route path="/science_p1.html" element={<ScienceP1 />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact.html" element={<Contact />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/legal.html" element={<Legal />} />
          <Route path="/index-fr.html" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}
