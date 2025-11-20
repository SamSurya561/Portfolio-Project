import React, { useState, useEffect } from 'react';
import { db } from '../firebase.js';
import { doc, onSnapshot } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Hero = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // State for Firebase data
  const [cvUrl, setCvUrl] = useState(null);
  const [profileImgUrl, setProfileImgUrl] = useState(null); 

  useEffect(() => {
    // Listen for website settings (CV, Profile Image, etc)
    const unsub = onSnapshot(doc(db, "settings", "website"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        // Get CV URL
        if (data.cvUrl) setCvUrl(data.cvUrl);
        
        // Get Profile Image URL
        if (data.profileImageUrl) setProfileImgUrl(data.profileImageUrl);
      }
    });
    return () => unsub();
  }, []);

  // Typing effect logic
  useEffect(() => {
    const words = ["Graphic Designer", "UI/UX Designer", "Web Designer"];
    
    const handleTyping = () => {
      const i = loopNum % words.length;
      const fullText = words[i];

      setText(isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1));
      setTypingSpeed(isDeleting ? 50 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  return (
    <section className="home reveal" id="home">
      <div className="home-container">
        <div className="home-section">
          <div className="info-home">
            <p className="home-p"><span className="home-s">. </span>Available for work</p>
            <h1>Hi, I'm Sharmila</h1>
            <h3>{text}<span className="cursor" style={{color: '#474af0'}}>|</span></h3>
            <div className="info-p">
              <p>I create beautiful, functional, and user-centered digital experiences.</p>
              <p>With 2+ years of experience in web development, I bring ideas to life through clean code and thoughtful design.</p>
            </div>
            <div className="info-p2">
              <p><i className="fa-solid fa-location-dot"></i> <h4>Based in : </h4>Chennai, Tamilnadu, India.</p>
              <p><i className="fa-solid fa-envelope"></i> <h4>Email : </h4>sharmilasharmi2128@gmail.com</p>
            </div>

            <div className="btnn">
              <button className="btn-home1"><i className="fa-solid fa-arrow-right"></i> Contact</button>
              <a 
                href={cvUrl || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <button className="btn-home2">
                  <i className="fa-solid fa-download"></i> {cvUrl ? "Download CV" : "CV Loading..."}
                </button>
              </a>
            </div>

            <div className="hhr"><hr /></div>

            <div className="follow">
              <p className="followw">Follow me:</p>
              <ul>
                
                <li><a href="http://www.linkedin.com/in/sharmila-sharmi" aria-label="LinkedIn"><i className="fa-brands fa-linkedin"></i></a></li>
                <li><a href="https://www.instagram.com/sharms__21/" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a></li>
                <a href="https://wa.me/213554139526" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Only render image if profileImgUrl exists */}
        {profileImgUrl && (
            <img 
              src={profileImgUrl} 
              alt="profile visual" 
            />
        )}
      </div>
    </section>
  );
};

export default Hero;