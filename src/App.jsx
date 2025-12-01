import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from './firebase';

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
import ProjectDetails from './components/ProjectDetails';
import ScrollManager from './components/ScrollManager';
import { ScrollProvider } from './contexts/ScrollContext';

const ScrollHandler = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if we need to scroll to a specific section
    if (location.state && location.state.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          const offset = 80; // Navbar height offset
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }, 100); // Small delay to ensure rendering
      }
    } else {
      window.scrollTo(0, 0);
    }

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
  // Store settings in state so we can re-apply them when theme changes
  const [websiteSettings, setWebsiteSettings] = useState(null);

  // 1. Listen to Firestore Data
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "website"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setWebsiteSettings(data);
        applyTheme(data); // Apply immediately on data change
      }
    });
    return () => unsub();
  }, []);

  // 2. Listen to Theme Changes (Light/Dark toggle)
  useEffect(() => {
    // Create a MutationObserver to watch for class changes on the <html> tag
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          // Re-apply theme settings whenever 'dark' class is added/removed
          if (websiteSettings) {
            applyTheme(websiteSettings);
          }
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, [websiteSettings]);

  const applyTheme = (settings) => {
    const root = document.documentElement;
    const body = document.body;

    // Check if Dark Mode is active
    const isDark = root.classList.contains('dark');

    // 1. Apply Accent Color
    if (settings.accentColor) {
      root.style.setProperty('--accent', settings.accentColor);
    }

    // 2. Reset Background
    body.style.backgroundImage = '';
    body.style.backgroundColor = '';

    // 3. Determine which values to use based on Mode
    const type = settings.backgroundType || 'solid';

    if (type === 'solid') {
      // Use Dark Color if dark mode, else Light Color
      const color = isDark
        ? (settings.darkBackgroundColor || '#121212')
        : (settings.lightBackgroundColor || '#ffffff');

      body.style.backgroundColor = color;
    }
    else if (type === 'gradient') {
      const start = isDark
        ? (settings.darkGradientStart || '#121212')
        : (settings.lightGradientStart || '#ffffff');

      const end = isDark
        ? (settings.darkGradientEnd || '#000000')
        : (settings.lightGradientEnd || '#f0f0f0');

      body.style.backgroundImage = `linear-gradient(135deg, ${start}, ${end})`;
      body.style.backgroundAttachment = 'fixed';
      body.style.backgroundSize = 'cover';
    }
    else if (type === 'image') {
      const imageUrl = isDark
        ? settings.darkBackgroundImageUrl
        : settings.lightBackgroundImageUrl;

      if (imageUrl) {
        body.style.backgroundImage = `url(${imageUrl})`;
        body.style.backgroundSize = 'cover';
        body.style.backgroundPosition = 'center';
        body.style.backgroundAttachment = 'fixed';
        body.style.backgroundRepeat = 'no-repeat';
      } else {
        // Fallback if image is missing for that mode
        body.style.backgroundColor = isDark ? '#121212' : '#ffffff';
      }
    }
  };

  return (
    <ScrollProvider>
      {loading && <Loader onLoaded={() => setLoading(false)} />}
      <Router>
        <ScrollManager />
        <ScrollHandler />
        {!loading && <Navbar />}
        <div id="main-page" className={!loading ? 'visible' : ''}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/all-projects" element={<AllProjects />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
          </Routes>
        </div>
      </Router>
    </ScrollProvider>
  );
}

export default App;