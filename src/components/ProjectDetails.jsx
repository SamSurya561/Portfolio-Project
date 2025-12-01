import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import './ProjectDetails.css';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "projects", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProject({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.log("No such project!");
                }
            } catch (error) {
                console.error("Error fetching project:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    // Image Carousel Logic
    const nextImage = () => {
        if (!project?.images?.length) return;
        setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    };

    const prevImage = () => {
        if (!project?.images?.length) return;
        setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
    };

    // Handle keyboard navigation for carousel
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [project]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="__fb_spinner"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="error-container">
                <h2 className="error-title">Project not found</h2>
                <button
                    onClick={() => navigate('/')}
                    className="action-btn secondary"
                    style={{ maxWidth: '200px' }}
                >
                    Back to Home
                </button>
            </div>
        );
    }

    // Prepare images array (use 'images' array or fallback to single 'imageUrl')
    const galleryImages = project.images && project.images.length > 0
        ? project.images
        : (project.imageUrl ? [project.imageUrl] : []);

    return (
        <>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="project-details-container"
            >
                {/* Back Button */}
                <button
                    onClick={() => navigate('/', { state: { scrollTo: 'project' } })}
                    className="back-btn"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Projects</span>
                </button>

                {/* Header Section */}
                <div className="project-header">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="project-title"
                    >
                        {project.title || 'Untitled Project'}
                    </motion.h1>

                    <div className="project-meta">
                        {project.date && (
                            <div className="meta-item">
                                <Calendar size={18} />
                                <span>{project.date}</span>
                            </div>
                        )}
                        {project.category && (
                            <div className="meta-item">
                                <Tag size={18} />
                                <span>{project.category}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="project-content-grid">

                    {/* Left Column: Image Carousel */}
                    <div className="left-column">
                        <div className="carousel-wrapper">
                            {galleryImages.length > 0 ? (
                                <AnimatePresence mode='wait'>
                                    <motion.img
                                        key={currentImageIndex}
                                        src={galleryImages[currentImageIndex]}
                                        alt={`Project view ${currentImageIndex + 1}`}
                                        initial={{ opacity: 0, scale: 1.05 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="carousel-image"
                                    />
                                </AnimatePresence>
                            ) : (
                                <div className="no-image-placeholder">
                                    No images available
                                </div>
                            )}

                            {/* Carousel Controls */}
                            {galleryImages.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                        className="carousel-control prev"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                        className="carousel-control next"
                                    >
                                        <ChevronRight size={24} />
                                    </button>

                                    {/* Indicators */}
                                    <div className="carousel-indicators">
                                        {galleryImages.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`indicator ${idx === currentImageIndex ? 'active' : ''}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Thumbnails (if more than 1 image) */}
                        {galleryImages.length > 1 && (
                            <div className="thumbnails-container">
                                {galleryImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`thumbnail-btn ${idx === currentImageIndex ? 'active' : ''}`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx}`} className="thumbnail-img" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Details & Info */}
                    <div className="info-column">

                        {/* Description */}
                        <div className="info-card">
                            <h3 className="info-title">About Project</h3>
                            <p className="info-text">
                                {project.fullDescription || project.description || "No description provided."}
                            </p>
                        </div>

                        {/* Tech Stack / Tags */}
                        <div className="info-card">
                            <h3 className="info-title">Technologies</h3>
                            <div className="tags-container">
                                {Array.isArray(project.tags) ? (
                                    project.tags.map((tag, i) => (
                                        <span key={i} className="tech-tag">
                                            {tag}
                                        </span>
                                    ))
                                ) : (
                                    project.tags?.split(',').map((tag, i) => (
                                        <span key={i} className="tech-tag">
                                            {tag.trim()}
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="actions-container">
                            {project.link && (
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="action-btn primary"
                                >
                                    <ExternalLink size={20} />
                                    Live Demo
                                </a>
                            )}

                            {project.githubLink && (
                                <a
                                    href={project.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="action-btn secondary"
                                >
                                    <Github size={20} />
                                    Source Code
                                </a>
                            )}
                        </div>

                    </div>
                </div>
            </motion.div>
            <Footer />
        </>
    );
};

export default ProjectDetails;
