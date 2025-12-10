import React, { useState, useEffect } from 'react';
import { db } from '../firebase.js';
import { collection, query, limit, onSnapshot } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Limit to 5 projects for the home page
        const q = query(collection(db, 'projects'), limit(5));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setProjects(docs);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching projects:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        // FIX 1: Reduced padding via inline style to close gap with previous section
        <section className="project reveal" id="project" style={{ padding: '60px 20px' }}>

            {/* FIX 2: Tighter margins for label and title */}
            <p className="section-label" style={{ marginBottom: '10px' }}>FEATURED WORK</p>
            <h1 className="section-title" style={{ marginBottom: '10px' }}>Projects</h1>

            {/* FIX 3: Reduced bottom margin from 50px to 30px to bring cards closer */}
            <div className="underline" style={{ margin: '0 auto 30px auto' }}></div>

            <div className="projects-container">
                {loading && <p className="__fb_muted" style={{ textAlign: 'center', width: '100%' }}>Loading projects...</p>}

                {!loading && projects.length === 0 && (
                    <p className="__fb_muted" style={{ textAlign: 'center', width: '100%' }}>No projects found.</p>
                )}

                {/* Render the 5 projects */}
                {!loading && projects.map((p) => (
                    <div
                        className="project-card"
                        key={p.id}
                        onClick={() => navigate(`/project/${p.id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img
                            src={p.imageUrl || 'https://placehold.co/600x400?text=No+Image'}
                            alt={p.title || 'Project'}
                        />
                        <h3>{p.title || 'Untitled Project'}</h3>
                        <p>{p.description ? p.description.substring(0, 100) + '...' : 'No description available.'}</p>

                        <div className="skills">
                            {Array.isArray(p.tags)
                                ? p.tags.map((t, i) => <a href="#" key={i} onClick={(e) => e.stopPropagation()}>{t}</a>)
                                : (p.tags ? p.tags.split(',').map((t, i) => <a href="#" key={i} onClick={(e) => e.stopPropagation()}>{t.trim()}</a>) : null)
                            }
                        </div>

                        <div className="btns">
                            {p.category && (
                                <a href="#" className="btn" onClick={(e) => e.stopPropagation()}>
                                    <i className="fa-solid fa-folder-open"></i> Category
                                </a>
                            )}
                            {/* Primary action: Go to Details */}
                            <button
                                className="btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/project/${p.id}`);
                                }}
                            >
                                <i className="fa-solid fa-circle-info"></i> View Project
                            </button>
                        </div>
                    </div>
                ))}

                {/* THE VIEW ALL CARD (The 6th Grid Item) */}
                {!loading && projects.length > 0 && (
                    <div
                        className="project-card view-all-card"
                        onClick={() => navigate('/all-projects')}
                    >
                        <div className="view-all-content">
                            <div className="view-all-icon">
                                <i className="fa-solid fa-arrow-right"></i>
                            </div>
                            <h3>( View All Projects )</h3>
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
};

export default Projects;