// src/components/ScrollManager.jsx
import { useEffect } from 'react';
import Lenis from 'lenis';
import { useScroll } from '../contexts/ScrollContext';

const ScrollManager = () => {
  const { setLenis } = useScroll();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Do not initialize Lenis on small screens (avoid jank)
    if (window.innerWidth <= 760) return;

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      direction: 'vertical',
      gestureOrientation: 'vertical'
    });

    setLenis(lenis);

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const handleResize = () => {
      if (window.innerWidth <= 760) {
        try {
          lenis.destroy();
          setLenis(null);
        } catch (e) { }
        if (rafId) cancelAnimationFrame(rafId);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      try {
        lenis.destroy();
        setLenis(null);
      } catch (e) { }
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, [setLenis]);

  return null;
};

export default ScrollManager;
