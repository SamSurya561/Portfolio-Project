// AllProjects.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import './AllProjects.css';

// Firebase v9 modular imports
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

/**
 * Firebase Initialization Helper
 */
const getFirestoreInstance = () => {
  try {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    };

    if (!firebaseConfig.apiKey) {
      console.warn('Firebase config missing. Using mock data for UI demo if needed.');
      return null;
    }

    if (!getApps().length) initializeApp(firebaseConfig);
    return getFirestore();
  } catch (err) {
    console.error('Firebase init error:', err);
    return null;
  }
};

const AllProjects = () => {
  // State
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('most-recent');
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs for Scroll Animations
  const observerRef = useRef(null);
  // 2. Initialize the hook
  const navigate = useNavigate();

  // 3. Create the click handler
  const handleProjectClick = (projectId) => {
    // This assumes your route is named '/project/:id'
    navigate(`/project/${projectId}`);
  };

  // 1. Fetch Projects
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const db = getFirestoreInstance();
        // If DB fails or not config, you might want to handle that. 
        // For now we assume DB exists or we catch error.
        if (!db) throw new Error("Database connection failed");

        const projectsCollection = collection(db, 'projects');
        const snapshot = await getDocs(projectsCollection);

        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(data);

        // Extract Categories
        const allCats = data.flatMap(p => p.categories || []);
        setCategories(['All', ...Array.from(new Set(allCats))]);
      } catch (err) {
        console.error(err);
        setError('Could not load projects. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // 2. Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 3. Filter & Sort Logic
  useEffect(() => {
    let result = [...projects];

    // Search
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.summary?.toLowerCase().includes(q) ||
        p.pills?.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // Category
    if (activeCategory !== 'All') {
      result = result.filter(p => p.categories?.includes(activeCategory));
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      if (sortOrder === 'most-recent') return dateB - dateA;
      if (sortOrder === 'oldest') return dateA - dateB;
      if (sortOrder === 'a-z') return a.title.localeCompare(b.title);
      if (sortOrder === 'z-a') return b.title.localeCompare(a.title);
      return 0;
    });

    setFilteredProjects(result);
  }, [projects, debouncedQuery, activeCategory, sortOrder]);

  // 4. Scroll Reveal Animation Observer
  useEffect(() => {
    // Disconnect previous observer
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observerRef.current.unobserve(entry.target); // Only animate once
        }
      });
    }, {
      threshold: 0.1, // Trigger when 10% visible
      rootMargin: "50px" // Start loading slightly before
    });

    const cards = document.querySelectorAll('.scroll-reveal');
    cards.forEach(card => observerRef.current.observe(card));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [filteredProjects, viewMode, isLoading]);

  // Render Skeletons
  const renderSkeletons = () => Array.from({ length: 6 }).map((_, i) => (
    <div key={i} className="project-card skeleton-card">
      <div className="skeleton-image" />
      <div className="card-content">
        <div className="skeleton-text title-sk" />
        <div className="skeleton-text body-sk" />
        <div className="skeleton-text body-sk short" />
        <div className="skeleton-tags" />
      </div>
    </div>
  ));

  return (
    <div className="all-projects-wrapper">

      {/* Header Section */}
      <header className="projects-header">
        <div className="header-content">
          <h1>Projects</h1>
          {/* <p>Curated works in UI/UX, Branding, and Development.</p> */}
        </div>
      </header>

      {/* Sticky Controls Bar */}
      <div className="controls-sticky-bar">
        <div className="controls-inner">

          {/* Search */}
          <div className="search-box">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-btn" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          {/* Filters & Toggles */}
          <div className="actions-group">
            <div className="custom-select">
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="most-recent">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="a-z">Name (A-Z)</option>
              </select>
              <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            <div className="view-toggles">
              <button
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid View"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                </svg>
              </button>
              <button
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List View"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Categories (Horizontal Scroll) */}
        <div className="categories-scroll">
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <main className={`projects-grid ${viewMode}`}>
        {isLoading ? renderSkeletons() : (
          filteredProjects.length > 0 ? filteredProjects.map((project, index) => (
            <article
              key={project.id}
              className="project-card scroll-reveal"
              style={{ transitionDelay: `${index * 50}ms` }} // Staggered entrance
              /* 4. ATTACH CLICK HANDLER HERE */
              onClick={() => handleProjectClick(project.id)}
              /* 5. Add accessibility props */
              role="button"
              tabIndex="0"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleProjectClick(project.id);
              }}
            >
              <div className="card-media">
                <img src={project.imageUrl} alt={project.title} loading="lazy" />
                <div className="overlay-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </div>

              <div className="card-content">
                <div className="card-header">
                  <h3>{project.title}</h3>
                  <div className="accent-dot"></div>
                </div>
                <p className="summary">{project.summary}</p>

                <div className="tags-wrapper">
                  {project.pills?.slice(0, 3).map((pill, i) => (
                    <span key={i} className="tag">{pill}</span>
                  ))}
                </div>
              </div>
            </article>
          )) : (
            <div className="empty-state">
              <h3>No projects found</h3>
              <p>Try adjusting your search or category filters.</p>
              <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}>Clear Filters</button>
            </div>
          )
        )}
      </main>

      {error && <div className="error-toast">{error}</div>}
    </div>
  );
};

export default AllProjects;