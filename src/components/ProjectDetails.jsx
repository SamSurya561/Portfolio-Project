import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./ProjectDetails.css";
import {
    FaArrowLeft,
    FaExternalLinkAlt,
    FaCalendarAlt,
    FaTags,
    FaChartLine,
    FaPercentage,
    FaUsers,
    FaRocket,
    FaChevronRight,
    FaImages,
    FaEye,
    FaLayerGroup,
    FaHome
} from "react-icons/fa";

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const contentRef = useRef([]);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const docRef = doc(db, "projects", id);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    setProject({ id: snap.id, ...snap.data() });
                } else {
                    console.error("Project not found");
                }
            } catch (error) {
                console.error("Error fetching project:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    useEffect(() => {
        if (!project) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.15 }
        );

        contentRef.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => {
            contentRef.current.forEach((el) => {
                if (el) observer.unobserve(el);
            });
        };
    }, [project]);


    const handleGoBack = () => {
        // Try to go back in history when possible. If that doesn't change the path
        // (e.g. user opened the page directly) fallback to /projects.
        try {
            const currentPath = window.location.pathname;

            // Attempt to navigate back
            navigate(-1);

            // After a short delay, if the path is still the same (no history), fallback.
            setTimeout(() => {
                const newPath = window.location.pathname;
                if (newPath === currentPath || newPath.startsWith('/project')) {
                    // Replace so user doesn't get stuck in a loop when they click back again.
                    navigate('/projects', { replace: true });
                }
            }, 150);
        } catch (err) {
            // If something goes wrong, just go to projects
            navigate('/projects', { replace: true });
        }
    };


    if (loading) {
        return (
            <div className="pd-loading-container">
                <div className="pd-loading-spinner"></div>
                <p>Loading project details...</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="pd-error">
                <h2>Project not found</h2>
                <Link to="/projects" className="pd-back-link">
                    <FaArrowLeft /> Back to Projects
                </Link>
            </div>
        );
    }

    // HERO: keep first/main image as hero/cover (unchanged)
    const mainImage =
        project.imageUrl ||
        project.image ||
        project.gallery?.[0] ||
        "";

    // GALLERY: exclude the hero image so bottom gallery shows "other photos"
    // If project.gallery has more than 1 image, we slice from index 1 onward.
    // If gallery is undefined or has 1 image, galleryImages will be empty.
    const galleryImages =
        Array.isArray(project.gallery) && project.gallery.length > 1
            ? project.gallery.slice(1)
            : [];

    return (
        <div className="pd-container">
            {/* Hero Section */}
            <div className="pd-hero">
                <div className="pd-hero-backdrop"
                    style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${mainImage})` }}>
                    <div className="pd-hero-content">
                        <div className="pd-navigation">
                            <button type="button" onClick={handleGoBack} className="pd-nav-back">
                                <FaArrowLeft /> Back to Projects
                            </button>

                            <Link to="/" className="pd-home-link">
                                <FaHome /> Home
                            </Link>
                        </div>

                        <div className="pd-hero-text">
                            <div className="pd-breadcrumb">
                                <Link to="/projects" className="pd-breadcrumb-item">
                                    Projects
                                </Link>
                                <FaChevronRight className="pd-breadcrumb-arrow" />
                                <span className="pd-breadcrumb-item active">{project.title}</span>
                            </div>

                            <h1 className="pd-title">{project.title}</h1>
                            <p className="pd-summary">
                                {project.summary || project.description || "No summary available."}
                            </p>


                            <div className="pd-hero-meta">
                                <div className="pd-meta-tag">
                                    <FaCalendarAlt className="pd-meta-icon" />
                                    <span>{project.date}</span>
                                </div>
                                <div className="pd-meta-tag">
                                    <FaTags className="pd-meta-icon" />
                                    <span>{project.categories?.[0] || project.tags?.[0] || "Project"}</span>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="pd-main">
                <div className="pd-content-wrapper">
                    {/* Left Column - Main Content */}
                    <div className="pd-content-main">
                        {/* MAIN IMAGE: replaced to show bottom gallery images (other photos) with prev/next.
                            Note: we intentionally do NOT show the hero image here again to avoid duplication.
                            If there are no other images, this block will not render. */}
                        {galleryImages.length > 0 && (
                            <div className="pd-section pd-main-image"
                                ref={(el) => (contentRef.current[0] = el)}>
                                <div className="pd-image-container" style={{ position: 'relative' }}>
                                    {/* Prev button */}
                                    <button
                                        className="pd-image-nav prev"
                                        onClick={() =>
                                            setActiveImage(prev =>
                                                prev === 0 ? galleryImages.length - 1 : prev - 1
                                            )
                                        }
                                        aria-label="Previous image"
                                    >
                                        ‹
                                    </button>

                                    {/* Active gallery image */}
                                    <img
                                        src={galleryImages[activeImage]}
                                        alt={`${project.title} — ${activeImage + 2}`}
                                        loading="lazy"
                                        style={{ display: 'block', width: '100%', borderRadius: 12 }}
                                    />

                                    {/* Next button */}
                                    <button
                                        className="pd-image-nav next"
                                        onClick={() =>
                                            setActiveImage(prev =>
                                                prev === galleryImages.length - 1 ? 0 : prev + 1
                                            )
                                        }
                                        aria-label="Next image"
                                    >
                                        ›
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Stats Cards */}
                        {project.stats && (
                            <div className="pd-section pd-stats-grid"
                                ref={(el) => (contentRef.current[1] = el)}>
                                <h2 className="pd-section-title">
                                    <FaChartLine className="pd-section-icon" />
                                    Performance Metrics
                                </h2>
                                <div className="pd-stats-container">
                                    <div className="pd-stat-card">
                                        <div className="pd-stat-header">
                                            <FaPercentage className="pd-stat-icon drop" />
                                            <h3>Drop Rate</h3>
                                        </div>
                                        <div className="pd-stat-value">
                                            {project.stats.drop || 0}%
                                        </div>
                                        <div className="pd-stat-progress">
                                            <div
                                                className="pd-stat-progress-bar"
                                                style={{ width: `${Number(project.stats?.drop || 0)}%` }}

                                            ></div>
                                        </div>
                                    </div>

                                    <div className="pd-stat-card">
                                        <div className="pd-stat-header">
                                            <FaEye className="pd-stat-icon ctr" />
                                            <h3>CTR</h3>
                                        </div>
                                        <div className="pd-stat-value">
                                            {project.stats.ctr || 0}%
                                        </div>
                                        <div className="pd-stat-progress">
                                            <div
                                                className="pd-stat-progress-bar ctr"
                                                style={{ width: `${Number(project.stats?.ctr || 0)}%` }}

                                            ></div>
                                        </div>
                                    </div>

                                    <div className="pd-stat-card">
                                        <div className="pd-stat-header">
                                            <FaRocket className="pd-stat-icon growth" />
                                            <h3>Growth</h3>
                                        </div>
                                        <div className="pd-stat-value">
                                            +{project.stats.growth || 0}%
                                        </div>
                                        <div className="pd-stat-progress">
                                            <div
                                                className="pd-stat-progress-bar growth"
                                                style={{ width: `${Math.min(Number(project.stats?.growth || 0), 100)}%` }}

                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Before/After Comparison */}
                        {(project.beforeImage || project.afterImage) && (
                            <div className="pd-section pd-comparison"
                                ref={(el) => (contentRef.current[2] = el)}>
                                <h2 className="pd-section-title">
                                    <FaLayerGroup className="pd-section-icon" />
                                    Before & After
                                </h2>
                                <div className="pd-comparison-grid">
                                    {project.beforeImage && (
                                        <div className="pd-comparison-card">
                                            <h3>Before</h3>
                                            <div className="pd-comparison-image">
                                                <img src={project.beforeImage} alt="Before" loading="lazy" />
                                            </div>
                                        </div>
                                    )}
                                    {project.afterImage && (
                                        <div className="pd-comparison-card">
                                            <h3>After</h3>
                                            <div className="pd-comparison-image">
                                                <img src={project.afterImage} alt="After" loading="lazy" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Gallery (thumbnails) - uses galleryImages so indices align with slider */}
                        {galleryImages.length > 0 && (
                            <div className="pd-section pd-gallery"
                                ref={(el) => (contentRef.current[3] = el)}>
                                <h2 className="pd-section-title">
                                    <FaImages className="pd-section-icon" />
                                    Gallery
                                </h2>
                                <div className="pd-gallery-grid">
                                    {galleryImages.map((img, index) => (
                                        <div
                                            key={index}
                                            className={`pd-gallery-item ${index === activeImage ? 'active' : ''}`}
                                            onClick={() => setActiveImage(index)}
                                        >
                                            <img src={img} alt={`Gallery ${index + 2}`} loading="lazy" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="pd-sidebar">
                        {/* Categories */}
                        <div className="pd-sidebar-card"
                            ref={(el) => (contentRef.current[4] = el)}>
                            <h3 className="pd-sidebar-title">
                                <FaTags className="pd-sidebar-icon" />
                                Categories
                            </h3>
                            <div className="pd-categories">
                                {(project.categories || project.tags || []).map((category, index) => (
                                    <span key={index} className="pd-category-tag">
                                        {category}
                                    </span>
                                ))}

                            </div>
                        </div>

                        {/* Project Info */}
                        <div className="pd-sidebar-card"
                            ref={(el) => (contentRef.current[5] = el)}>
                            <h3 className="pd-sidebar-title">
                                <FaCalendarAlt className="pd-sidebar-icon" />
                                Project Details
                            </h3>
                            <div className="pd-info-list">
                                <div className="pd-info-item">
                                    <span className="pd-info-label">Published</span>
                                    <span className="pd-info-value">{project.date}</span>
                                </div>
                                {project.prototype && (
                                    <div className="pd-info-item">
                                        <span className="pd-info-label">Prototype</span>
                                        <a
                                            href={project.prototype?.startsWith("http")
                                                ? project.prototype
                                                : `https://${project.prototype}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="pd-prototype-link"
                                        >
                                            <FaExternalLinkAlt /> View Prototype
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        {project.stats && (
                            <div className="pd-sidebar-card"
                                ref={(el) => (contentRef.current[6] = el)}>
                                <h3 className="pd-sidebar-title">
                                    <FaChartLine className="pd-sidebar-icon" />
                                    Quick Stats
                                </h3>
                                <div className="pd-quick-stats">
                                    <div className="pd-quick-stat">
                                        <span className="pd-quick-stat-label">Drop</span>
                                        <span className="pd-quick-stat-value drop">
                                            {project.stats.drop || 0}%
                                        </span>
                                    </div>
                                    <div className="pd-quick-stat">
                                        <span className="pd-quick-stat-label">CTR</span>
                                        <span className="pd-quick-stat-value ctr">
                                            {project.stats.ctr || 0}%
                                        </span>
                                    </div>
                                    <div className="pd-quick-stat">
                                        <span className="pd-quick-stat-label">Growth</span>
                                        <span className="pd-quick-stat-value growth">
                                            +{project.stats.growth || 0}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Back Button in Sidebar */}
                        <div className="pd-sidebar-card pd-sidebar-actions">
                            <button onClick={handleGoBack} className="pd-sidebar-back-btn">
                                <FaArrowLeft /> Back to Projects
                            </button>
                            <Link to="/" className="pd-sidebar-home-btn">
                                <FaHome /> Go to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
