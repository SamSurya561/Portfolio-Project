import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToggleTheme } from './ToggleTheme';
import { House, User, FolderOpen, Code, Mail } from 'lucide-react';

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
      let scrollPos = window.scrollY + 150; // Offset for earlier triggering

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
      // Different offset for mobile vs desktop if needed
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

  const navItems = [
    { id: 'home', icon: <House size={20} />, text: 'Home' },
    { id: 'about', icon: <User size={20} />, text: 'About' },
    { id: 'project', icon: <FolderOpen size={20} />, text: 'Projects' },
    { id: 'skills', icon: <Code size={20} />, text: 'Skills' },
    { id: 'contact', icon: <Mail size={20} />, text: 'Contact' }
  ];

  return (
    <>
      {/* --- DESKTOP HEADER (Hidden on Mobile via CSS) --- */}
      <header className="header-list desktop-header" role="navigation">
        <div className="div-list">
          <ul className="ul-list">
            {navItems.map(item => (
              <li key={item.id} className={activeLink === item.id ? 'active' : ''}>
                <span className="icon-wrapper">{item.icon}</span>
                <a href={`#${item.id}`} onClick={(e) => handleClick(e, item.id)}>
                  {item.text}
                </a>
              </li>
            ))}
            <li><ToggleTheme /></li>
          </ul>
        </div>
      </header>

      {/* --- MOBILE BOTTOM LIQUID NAV --- */}
      <div className="mobile-bottom-nav">
        <nav className="glass-dock">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`dock-item ${activeLink === item.id ? 'active' : ''}`}
              onClick={(e) => handleClick(e, item.id)}
            >
              <div className="icon-container">
                {item.icon}
              </div>
              <span className="dock-label">{item.text}</span>
              
              {/* Fluid Background Indicator */}
              {activeLink === item.id && (
                <div className="fluid-bubble" layoutId="bubble" />
              )}
            </a>
          ))}
          
          {/* Theme Toggle Integrated into Dock */}
          <div className="dock-item theme-item">
             <ToggleTheme />
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;