// Projects.jsx — replace your current file with this
import React, { useState, useEffect } from "react";
import { collection, query, limit, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase.js"; // use the already-initialized db from your repo

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const fetchProjects = async () => {
      setLoading(true);
      try {
        if (!db) {
          console.error("Firestore 'db' is not available. Check firebase.js export.");
          setProjects([]);
          return;
        }

        // fetch up to 12 documents while debugging; adjust limit later
        const q = query(collection(db, "projects"), limit(12));
        const snap = await getDocs(q);

        console.log("Projects snapshot size:", snap.size);
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        console.log("Fetched projects:", docs);

        if (mounted) setProjects(docs);
      } catch (err) {
        console.error("Error fetching projects:", err);
        if (mounted) setProjects([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProjects();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="project reveal" id="project" style={{ padding: "60px 20px" }}>
      <p className="section-label" style={{ marginBottom: "10px" }}>
        FEATURED WORK
      </p>
      <h1 className="section-title" style={{ marginBottom: "10px" }}>
        Projects
      </h1>
      <div className="underline" style={{ margin: "0 auto 30px auto" }}></div>

      <div className="projects-container">
        {loading && (
          <p className="__fb_muted" style={{ textAlign: "center", width: "100%" }}>
            Loading projects...
          </p>
        )}

        {!loading && projects.length === 0 && (
          <p className="__fb_muted" style={{ textAlign: "center", width: "100%" }}>
            No projects found.
          </p>
        )}

        {!loading &&
          projects.map((p) => (
            <div
              className="project-card"
              key={p.id}
              onClick={() => navigate(`/project/${p.id}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={p.imageUrl || "https://placehold.co/600x400?text=No+Image"}
                alt={p.title || "Project"}
              />

              <h3>{p.title || "Untitled Project"}</h3>

              <p>
                {p.summary ? (p.summary.length > 110 ? p.summary.substring(0, 110) + "..." : p.summary) : "No description available."}
              </p>

              <div className="skills">
                {Array.isArray(p.pills) && p.pills.slice(0, 3).map((t, i) => (
                  <a href="#" key={i} onClick={(e) => e.stopPropagation()}>
                    {t}
                  </a>
                ))}
              </div>

              <div className="btns">
                {Array.isArray(p.categories) && p.categories[0] && (
                  <a href="#" className="btn" onClick={(e) => e.stopPropagation()}>
                    <i className="fa-solid fa-folder-open"></i> {p.categories[0]}
                  </a>
                )}

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

        {/* View All Card */}
        {!loading && projects.length > 0 && (
          <div className="project-card view-all-card" onClick={() => navigate("/all-projects")}>
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
