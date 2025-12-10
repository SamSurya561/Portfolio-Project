import React, { useEffect, useState } from "react";
import { db } from "../firebase.js";
import { collection, getDocs, query, limit, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

/**
 * Projects.jsx — limited display version
 * - change DISPLAY_LIMIT to control how many cards render on this page
 * - if more projects exist, a "View All Projects" pill is shown
 */

const DISPLAY_LIMIT = 5; // ← change this number to show more/less on the page

const normalize = (docOrData) => {
  const data = typeof docOrData.data === "function" ? docOrData.data() : docOrData;
  const tagsRaw = data.pills ?? data.categories ?? data.tags ?? [];
  const tags =
    Array.isArray(tagsRaw)
      ? tagsRaw
      : typeof tagsRaw === "string"
        ? tagsRaw.split(",").map(t => t.trim())
        : [];
  return {
    id: docOrData.id || data.id,
    title: data.title || data.name || "Untitled Project",
    summary: data.summary || data.description || "",
    imageUrl: data.imageUrl || data.image || "https://placehold.co/600x400?text=No+Image",
    tags,
    date: data.date || ""
  };
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const colRef = collection(db, "projects");
    const q = query(colRef, limit(50)); // fetch up to 50 (adjust if you have many)

    (async () => {
      try {
        const snap = await getDocs(q);
        const docs = snap.docs.map(d => normalize(d));
        setProjects(docs);
        setFiltered(docs);
        setLoading(false);
      } catch (err) {
        console.error("Projects getDocs error:", err);
        setProjects([]);
        setFiltered([]);
        setLoading(false);
      }
    })();

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => normalize(d));
      setProjects(docs);
      setFiltered(docs);
      setLoading(false);
    }, (err) => {
      console.error("Projects onSnapshot error:", err);
      setLoading(false);
    });

    return () => { try { unsubscribe(); } catch (e) { } };
  }, []);

  const filterBy = (cat) => {
    setActiveFilter(cat);
    if (cat === "All") {
      setFiltered(projects);
      return;
    }
    const result = projects.filter(p =>
      p.tags && p.tags.some(t => t.toLowerCase().includes(cat.toLowerCase()))
    );
    setFiltered(result);
  };

  // Only show first DISPLAY_LIMIT items from the filtered set
  const visibleProjects = filtered.slice(0, DISPLAY_LIMIT);
  const moreAvailable = filtered.length > DISPLAY_LIMIT;

  return (
    <section className="project reveal" id="project">
      <p className="section-label">FEATURED WORK</p>
      <h1 className="section-title">Projects</h1>
      <div className="underline"></div>

      <div className="filter-bar">
        {["All", "UI/UX", "Branding", "Web", "App"].map(c => (
          <button
            key={c}
            className={`filter-btn ${activeFilter === c ? "active" : ""}`}
            onClick={() => filterBy(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="projects-container">
        {loading &&
          Array.from({ length: Math.min(DISPLAY_LIMIT, 6) }).map((_, i) => (
            <div key={i} className="project-card skeleton">
              <div className="skeleton-img"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line sm"></div>
            </div>
          ))}

        {!loading && visibleProjects.map(p => (
          <div
            className="project-card premium-card show"
            key={p.id}
            onClick={() => navigate(`/project/${p.id}`)}
          >
            <div className="img-wrap">
              <img src={p.imageUrl} alt={p.title} />
            </div>

            <h3>{p.title}</h3>

            <p>
              {p.summary ? (p.summary.length > 120 ? p.summary.substring(0, 120) + "..." : p.summary) : "No description available."}
            </p>

            <div className="skills">
              {p.tags && p.tags.map((t, i) => (
                <a key={i} href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>{t}</a>
              ))}
            </div>

            <div className="btns">
              <button
                className="btn"
                onClick={(e) => { e.stopPropagation(); navigate(`/project/${p.id}`); }}
              >
                <i className="fa-solid fa-circle-info"></i> View Project
              </button>
            </div>
          </div>
        ))}

        {/* View All pill appears if more results exist */}
        {!loading && moreAvailable && (
          <div
            className="project-card view-all-card"
            onClick={() => navigate("/all-projects")}
          >
            <div className="view-all-content">
              <div className="view-all-icon">
                <i className="fa-solid fa-arrow-right"></i>
              </div>
              <h3>( View All Projects )</h3>
            </div>
          </div>
        )}

        {/* If there are no filtered projects to show at all */}
        {!loading && filtered.length === 0 && (
          <div style={{ width: "100%", textAlign: "center", padding: 40, color: "#666" }}>
            No projects found.
          </div>
        )}
      </div>
    </section>
  );
}
