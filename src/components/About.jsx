import React, { useState, useEffect } from 'react';
import { db } from '../firebase.js';
import { doc, onSnapshot } from "firebase/firestore";
import { ScrollTimeline } from "./ScrollTimeline";

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
      {/* FIX 1: Removed <p> wrapper around h1. This removes the massive top gap. */}
      <h1 style={{ marginBottom: '5px' }}>ABOUT ME</h1>

      {/* FIX 2: Added inline style to override the global 'padding-bottom: 30px' for this specific subtitle */}
      <p style={{ paddingBottom: '15px', color: 'gray', fontWeight: '500' }}>
        Building Meaningful Digital Experiences
      </p>

      {/* FIX 3: Reduced padding-bottom from 40px to 30px on the line container */}
      <div className="hrrr" style={{ width: '100%', paddingBottom: '30px' }}>
        <hr style={{ width: '10%', margin: '0' }} />
      </div>

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
      <ScrollTimeline />
    </section>
  );
};

export default About;