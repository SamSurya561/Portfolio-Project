import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToggleTheme } from './ToggleTheme';
import { House, User, FolderOpen, Code, Mail } from 'lucide-react';
import { motion } from 'framer-motion'; // Ensure framer-motion is installed

const Navbar = () => {
  const [activeLink, setActiveLink] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/all-projects') {
      setActiveLink('project');
      return;
    }

    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let scrollPos = window.scrollY + 150;

      sections.forEach(section => {
        if (scrollPos >= section.offsetTop && scrollPos < (section.offsetTop + section.offsetHeight)) {
          setActiveLink(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const handleClick = (e, id) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        scrollToSection(id);
      }, 100);
    } else {
      scrollToSection(id);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 20;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveLink(id);
    }
  };

  // FIX 1: Store component reference (Icon) instead of static element (<Icon/>)
  const navItems = [
    { id: 'home', Icon: House, text: 'Home' },
    { id: 'about', Icon: User, text: 'About' },
    { id: 'project', Icon: FolderOpen, text: 'Projects' },
    { id: 'skills', Icon: Code, text: 'Skills' },
    { id: 'contact', Icon: Mail, text: 'Contact' }
  ];

  return (
    <>
      {/* --- DESKTOP HEADER --- */}
      <header className="header-list desktop-header" role="navigation">
        <div className="div-list">
          <ul className="ul-list">
            {navItems.map(item => {
              const isActive = activeLink === item.id;
              return (
                <li key={item.id} className={isActive ? 'active' : ''}>
                  <span className="icon-wrapper">
                    {/* Pass color prop dynamically for desktop as well if needed */}
                    <item.Icon size={20} />
                  </span>
                  <a href={`#${item.id}`} onClick={(e) => handleClick(e, item.id)}>
                    {item.text}
                  </a>
                </li>
              );
            })}
            <li><ToggleTheme /></li>
          </ul>
        </div>
      </header>

      {/* --- MOBILE BOTTOM LIQUID NAV --- */}
      <div className="mobile-bottom-nav">
        <nav className="glass-dock">
          {navItems.map((item) => {
            const isActive = activeLink === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`dock-item ${isActive ? 'active' : ''}`}
                onClick={(e) => handleClick(e, item.id)}
                style={{ position: 'relative', isolation: 'isolate' }} // Creates stacking context
              >
                {/* FIX 2: Add Z-Index and Dynamic Color */}
                <div
                  className="icon-container"
                  style={{
                    position: 'relative',
                    zIndex: 20, // Ensures icon is ABOVE the bubble
                    transition: 'color 0.3s ease'
                  }}
                >
                  <item.Icon
                    size={20}
                    // FIX 3: Force white color when active for visibility
                    color={isActive ? "#ffffff" : "currentColor"}
                  />
                </div>

                <span
                  className="dock-label"
                  style={{
                    position: 'relative',
                    zIndex: 20, // Ensures text is ABOVE the bubble
                    color: isActive ? "#ffffff" : "currentColor"
                  }}
                >
                  {item.text}
                </span>

                {/* Fluid Background Indicator */}
                {isActive && (
                  <motion.div
                    className="fluid-bubble"
                    layoutId="bubble"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    style={{
                      position: 'absolute',
                      zIndex: 10, // Sits BEHIND the icon
                      inset: 0,
                      margin: 'auto',
                      // Ensure bubble has a background color if CSS fails
                      backgroundColor: 'var(--accent)',
                      borderRadius: '50%'
                    }}
                  />
                )}
              </a>
            );
          })}

          <div className="dock-item theme-item">
            <ToggleTheme />
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;