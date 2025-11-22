import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Components
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AllProjects from './components/AllProjects';
import ScrollManager from './components/ScrollManager';


// ScrollHandler to manage scroll behavior
const ScrollHandler = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Reset scroll to top on route change

    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const revealPoint = 150;

        if (elementTop < windowHeight - revealPoint) {
          el.classList.add('active-reveal');
        }
      });
    };

    setTimeout(handleScroll, 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  return null;
};

// Home Page Component (Removed Navbar from here)
const Home = () => (
  <>
    <main>
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Contact />
    </main>
    <Footer />
  </>
);

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* Loader */}
      {loading && <Loader onLoaded={() => setLoading(false)} />}

      <Router>
        <ScrollManager />

        {/* FIX: Navbar is now outside the animated main-page div */}
        {/* We show it only when loading is finished so it fades in nicely */}
        {!loading && <Navbar />}

        {/* Main Content (This animates up) */}
        <div id="main-page" className={!loading ? 'visible' : ''}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/all-projects" element={<AllProjects />} />
          </Routes>
        </div>

        {/* Rating Popup - Shows on all pages */}
        {!loading}
      </Router>
    </>
  );
}

export default App;