import React from 'react';
import { Link } from 'react-router-dom';


const Footer = () => {
  // Smooth scroll handler
  const handleClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="footer">

      <div className="footer-container">
        <h2 className="footer-logo">Sharmila</h2>
        <ul className="footer-links">
          <li><a href="#home" onClick={(e) => handleClick(e, 'home')}>Home</a></li>
          <li><a href="#about" onClick={(e) => handleClick(e, 'about')}>About</a></li>
          <li><a href="#project" onClick={(e) => handleClick(e, 'project')}>Projects</a></li>
          <li><a href="#skils" onClick={(e) => handleClick(e, 'skills')}>Skills</a></li>
          <li><a href="#contact" onClick={(e) => handleClick(e, 'contact')}>Contact</a></li>
        </ul>

        <div className="footer-social">
          <a href="https://www.linkedin.com/in/amine-hamzaoui-a2453a35b" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fa-brands fa-linkedin"></i></a>
          <a href="https://www.instagram.com/sharms__21/" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
          <a href="https://wa.me/213554139526" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
        </div>

        <p className="footer-copy">&copy; 2025 SURYA ❤︎. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;