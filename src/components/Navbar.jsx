// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// keep any existing imports (firebase if present) above — this file does not remove them
import { ToggleTheme } from './ToggleTheme';
import { House, User, FolderOpen, Code, Mail, Menu as MenuIcon, X } from 'lucide-react';

const Navbar = () => {
  // existing nav state logic preserved
  const [activeLink, setActiveLink] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/all-projects') {
      setActiveLink('project');
      return;
    }

    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let scrollPos = window.scrollY + 100;

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
    setMobileOpen(false); // close mobile menu on click
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
          setActiveLink(id);
        }
      }, 450);
    } else {
      const element = document.getElementById(id);
      if (element) {
        window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
        setActiveLink(id);
      }
    }
  };

  const navItems = [
    { id: 'home', icon: <House size={18} />, text: 'Home' },
    { id: 'about', icon: <User size={18} />, text: 'About' },
    { id: 'project', icon: <FolderOpen size={18} />, text: 'Projects' },
    { id: 'skills', icon: <Code size={18} />, text: 'Skills' },
    { id: 'contact', icon: <Mail size={18} />, text: 'Contact' }
  ];

  return (
    <>
      {/* Desktop / Tablet header — keep your original desktop header look and logic */}
      <header className="header-list desktop-header" role="navigation" aria-label="Primary navigation">
        <div className="div-list">
          <ul className="ul-list">
            {navItems.map(item => (
              <li key={item.id} className={activeLink === item.id ? 'active' : ''}>
                <span className="icon-wrapper" aria-hidden="true">{item.icon}</span>
                <a href={`#${item.id}`} onClick={(e) => handleClick(e, item.id)}>
                  {item.text}
                </a>
              </li>
            ))}
            <li>
              <ToggleTheme />
            </li>
          </ul>
        </div>
      </header>

      {/*
        Mobile glass nav (non-invasive).
        NOTE: this block only adds mobile UI and uses the same navItems / handleClick logic above.
      */}
      <div className="mobile-nav-wrapper" aria-hidden={false}>
        <button
          className="mobile-menu-toggle"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen(p => !p)}
          type="button"
        >
          {mobileOpen ? <X size={20} /> : <MenuIcon size={20} />}
        </button>

        <nav className={`mobile-glass-menu ${mobileOpen ? 'open' : ''}`} role="navigation" aria-label="Mobile menu">
          <ul>
            {navItems.map(item => (
              <li key={item.id} className={activeLink === item.id ? 'active' : ''}>
                <button
                  className="mobile-nav-btn"
                  onClick={(e) => handleClick(e, item.id)}
                  aria-current={activeLink === item.id ? 'page' : undefined}
                  type="button"
                >
                  <span className="mobile-icon" aria-hidden="true">{item.icon}</span>
                  <span className="mobile-text">{item.text}</span>
                </button>
              </li>
            ))}
            <li className="theme-mobile">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ToggleTheme />
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
