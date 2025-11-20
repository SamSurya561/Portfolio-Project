import React, { useEffect, useState } from 'react';

const Loader = ({ onLoaded }) => {
  const [active, setActive] = useState(true);

  useEffect(() => {
    // Duration of the animation before triggering the exit
    const timer = setTimeout(() => {
      setActive(false);
      // Wait for the exit animation to finish before removing the loader from DOM
      setTimeout(onLoaded, 1000); 
    }, 3500); 

    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <div className={`loader-container ${!active ? 'slide-out' : ''}`}>
      <div className="loader-content">
        <div className="text-wrapper">
          <span className="letter">S</span>
          <span className="letter">H</span>
          <span className="letter">A</span>
          <span className="letter">R</span>
          <span className="letter">M</span>
          <span className="letter">I</span>
          <span className="letter">L</span>
          <span className="letter">A</span>
          <span className="dot">.</span>
        </div>
        <div className="loader-line"></div>
        <p className="loader-subtitle">Graphic & UI/UX Designer</p>
      </div>
    </div>
  );
};

export default Loader;