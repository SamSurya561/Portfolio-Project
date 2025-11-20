import React, { useEffect, useState } from 'react';
import { db } from '../firebase.js'; // Ensure this path matches the file created above
import { doc, onSnapshot } from "firebase/firestore";

const Skills = () => {
  const [designSkills, setDesignSkills] = useState([]);
  const [technicalSkills, setTechnicalSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "settings", "website"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const allSkills = data.skills || [];
        
        setDesignSkills(allSkills.filter(s => s.category === 'Design'));
        setTechnicalSkills(allSkills.filter(s => s.category === 'Technical'));
      } else {
        console.log("No settings document found!");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const SkillBar = ({ skill }) => (
    <div className="skill-item">
      <div className="skill-info">
        <span className="skill-name">{skill.name}</span>
        <span className="skill-percentage">{skill.percentage}%</span>
      </div>
      <div className="progress-bar-bg">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${skill.percentage}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <section className="skills-section reveal" id="skills">
      <p className="section-label">MY EXPERTISE</p>
      <h1 className="section-title">My Skills</h1>
      <div className="underline"></div>

      {loading ? (
        <p style={{textAlign: 'center', color: '#000000ff'}}>Loading skills...</p>
      ) : (
        <div className="skills-grid">
          <div className="skills-card">
            <h3 className="skills-category-title">Design Skills</h3>
            <div className="skills-list">
              {designSkills.map((skill, index) => (
                <SkillBar key={index} skill={skill} />
              ))}
              {designSkills.length === 0 && <p className="__fb_muted">No design skills added yet.</p>}
            </div>
          </div>

          <div className="skills-card">
            <h3 className="skills-category-title">Technical Skills</h3>
            <div className="skills-list">
              {technicalSkills.map((skill, index) => (
                <SkillBar key={index} skill={skill} />
              ))}
              {technicalSkills.length === 0 && <p className="__fb_muted">No technical skills added yet.</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Skills;