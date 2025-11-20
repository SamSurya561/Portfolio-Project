import React, { useState, useEffect } from 'react';
import { db } from '../firebase.js';
import { doc, onSnapshot } from "firebase/firestore";

// Fallback image
import localAboutImg from '../assets/img.jpg'; 

const About = () => {
  const [aboutImgUrl, setAboutImgUrl] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "website"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.aboutImageUrl) setAboutImgUrl(data.aboutImageUrl);
      }
    });
    return () => unsub();
  }, []);

  return (
    <section className="about reveal" id="about">
      <p className="about-label"><h1>ABOUT ME</h1></p>
      <div className="title">
        <p><h2>Building Meaningful Digital Experiences</h2></p>
        
      </div>
      <div className="hrrr"><hr /></div>

      <div className="about-container">
        <div className="info-about">
          <div className="about-info">
            <p>I'm a creative front-end developer passionate about building modern and responsive web experiences.
              My journey began with a love for design and evolved into a deep curiosity for how the web works — combining logic with creativity to bring ideas to life.</p>
            <p>When I'm not coding, I enjoy learning new technologies, improving my projects,
              and exploring better ways to make the web faster and more engaging. I believe in continuous learning, attention to detail, and the power of clean, meaningful design.</p>
          </div>

          <h2>What Drives Me</h2>
          <div className="card">
            <div className="c1">
              <h3><i className="fa-solid fa-code"></i> Languages</h3>
              <p>HTML, CSS, JavaScript, Java, React</p>
            </div>
            <div className="c1">
              <h3><i className="fa-solid fa-graduation-cap"></i> Education</h3>
              <p>USTHB in Computer Science</p>
            </div>
            <div className="c1">
              <h3><i className="fa-solid fa-folder-open"></i> Projects</h3>
              <p>Built more than 5 projects</p>
            </div>
          </div>
        </div>

        {/* Use Firebase image if available, otherwise local */}
        <img 
          src={aboutImgUrl || localAboutImg} 
          alt="about visual" 
        />
      </div>
    </section>
  );
};

export default About;