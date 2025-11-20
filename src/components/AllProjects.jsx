import React, { useState, useEffect } from 'react';
import { db } from '../firebase.js';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import Navbar from './Navbar';
import Footer from './Footer';

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query ALL projects (no limit)
    const q = query(collection(db, 'projects'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setProjects(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <section className="project" id="project">
          <p>PORTFOLIO</p>
          <h1>All Projects</h1>
          <hr style={{ width: '10%' }} />
          
          <div className="projects-container" style={{ marginTop: '40px' }}>
            {loading && <p style={{textAlign:'center'}}>Loading all projects...</p>}
            
            {projects.map((p) => (
              <div className="project-card" key={p.id}>
                <img 
                  src={p.imageUrl || 'https://placehold.co/600x400?text=No+Image'} 
                  alt={p.title} 
                />
                <h3>{p.title || 'Untitled'}</h3>
                <p>{p.description ? p.description.substring(0, 100) + '...' : ''}</p>
                
                <div className="skills">
                  {Array.isArray(p.tags) 
                    ? p.tags.map((t, i) => <a href="#" key={i}>{t}</a>)
                    : (p.tags ? p.tags.split(',').map((t, i) => <a href="#" key={i}>{t.trim()}</a>) : null)
                  }
                </div>

                <div className="btns">
                   {p.link || p.id ? (
                      <a href={p.link || '#'} className="btn" target="_blank" rel="noopener noreferrer" style={{width:'100%'}}>
                        <i className="fa-solid fa-eye"></i> View Project
                      </a>
                   ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AllProjects;