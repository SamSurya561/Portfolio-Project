// Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToggleTheme } from "./ToggleTheme";
import { House, User, FolderOpen, Code, Mail, X, Search } from "lucide-react";
import { useScroll } from "../contexts/ScrollContext";
// add near other imports at top of Navbar.jsx
import { db } from "../firebase";
import { collection, getDocs, limit, query as fbQuery } from "firebase/firestore";


/**
 * Updated Navbar: desktop pills unchanged.
 * Mobile: hamburger -> premium glass bottom sheet with:
 *  - glass top drag handle
 *  - peek bounce animation
 *  - quick-close X
 *  - search bar inside menu (filters items)
 *  - iOS-style blur gradient shadow
 *
 * Make sure lucide-react exports X and Search in your version.
 */

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const { lenis } = useScroll();

  // Refs for pills & mobile panel
  const dockRef = useRef(null);
  const pillRef = useRef(null);
  const ulRef = useRef(null);
  const desktopPillRef = useRef(null);
  const panelRef = useRef(null);

  // timers/flags
  const autoScrollTimerRef = useRef(null);
  const autoScrollRef = useRef(false);
  const mobilePopTimeoutRef = useRef(null);
  const desktopPopTimeoutRef = useRef(null);


  // add immediately after your searchTerm state
  const [projects, setProjects] = useState([]);          // all projects for client-side search
  const [projectResults, setProjectResults] = useState([]); // filtered project hits

  // Focus trap
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  const navItemsAll = [
    { id: "home", Icon: House, text: "Home" },
    { id: "about", Icon: User, text: "About" },
    { id: "project", Icon: FolderOpen, text: "Projects" },
    { id: "skills", Icon: Code, text: "Skills" },
    { id: "contact", Icon: Mail, text: "Contact" }
  ];

  // Filtered for search in mobile menu
  const filteredNavItems = navItemsAll.filter((it) =>
    it.text.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  /* ---------------- Scroll spy (ignore while auto-scroll lock) ---------------- */
  useEffect(() => {
    if (location.pathname === "/all-projects") {
      setActiveLink("project");
      return;
    }
    const handleScroll = () => {
      if (autoScrollRef.current) return;
      const sections = document.querySelectorAll("section[id]");
      const scrollPos = window.scrollY + 150;
      sections.forEach((section) => {
        if (
          scrollPos >= section.offsetTop &&
          scrollPos < section.offsetTop + section.offsetHeight
        ) {
          setActiveLink(section.id);
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  // add this useEffect (fetch projects for mobile search)
  useEffect(() => {
    let cancelled = false;

    const fetchProjects = async () => {
      try {
        // limit to 50 to avoid massive downloads; change if you want more
        const q = fbQuery(collection(db, "projects"), limit(50));
        const snap = await getDocs(q);
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (!cancelled) setProjects(docs);
      } catch (err) {
        console.error("Navbar: failed to load projects for search", err);
      }
    };

    fetchProjects();
    return () => { cancelled = true; };
  }, []);


  /* ---------------- Smooth scroll helper (uses lenis when available) ---------------- */
  const scrollToSection = (id) => {
    if (!id) return;
    const offset = 20; // Offset for header/spacing

    // 1. If Lenis is active (desktop mostly), use it
    if (lenis) {
      const element = document.getElementById(id);
      if (element) {
        lenis.scrollTo(element, { offset: -offset, duration: 1.2 });
      }
      return;
    }

    // 2. Fallback for mobile / no-lenis
    const tryScroll = (attempt = 1) => {
      const element = document.getElementById(id);
      if (!element) {
        // Retry a few times if element isn't found yet (e.g. dynamic content)
        if (attempt <= 3) setTimeout(() => tryScroll(attempt + 1), 200);
        return;
      }

      // Calculate position manually to avoid scrollIntoView + scrollBy conflict
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    };
    tryScroll();
  };

  /* ---------------- Click handler (sets active visually + programmatic scroll lock) ---------------- */
  const handleClick = (e, id) => {
    if (e && e.preventDefault) e.preventDefault();

    // immediate visual update
    setActiveLink(id);

    // Lock scroll spy while programmatic scroll happens
    autoScrollRef.current = true;
    if (autoScrollTimerRef.current) clearTimeout(autoScrollTimerRef.current);
    autoScrollTimerRef.current = setTimeout(() => {
      autoScrollRef.current = false;
      autoScrollTimerRef.current = null;
    }, 900);

    // navigate to home if necessary then scroll
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSection(id), 300);
    } else {
      scrollToSection(id);
    }

    // small feedback
    try { if (navigator.vibrate) navigator.vibrate(12); } catch (e) { }
  };

  /* ---------------- Focus trap & body lock when mobileOpen ---------------- */
  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }

    previouslyFocusedRef.current = document.activeElement;
    const panel = panelRef.current;
    if (!panel) return;

    const focusable = panel.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) {
      firstFocusableRef.current = focusable[0];
      lastFocusableRef.current = focusable[focusable.length - 1];
      try { focusable[0].focus(); } catch (e) { }
    }

    const onKey = (ev) => {
      if (ev.key === "Escape") {
        setMobileOpen(false);
      }
      if (ev.key === "Tab") {
        if (focusable.length === 0) return;
        if (ev.shiftKey && document.activeElement === firstFocusableRef.current) {
          ev.preventDefault();
          lastFocusableRef.current.focus();
        } else if (!ev.shiftKey && document.activeElement === lastFocusableRef.current) {
          ev.preventDefault();
          firstFocusableRef.current.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    addPanelListeners();

    return () => {
      document.removeEventListener("keydown", onKey);
      removePanelListeners();
      try {
        if (previouslyFocusedRef.current) previouslyFocusedRef.current.focus();
      } catch (e) { }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileOpen]);

  /* ---------------- Swipe handlers for panel (pointer events) ---------------- */
  const dragState = useRef({ active: false, startY: 0, lastY: 0, currentTranslate: 0 });

  const addPanelListeners = () => {
    const panel = panelRef.current;
    if (!panel) return;
    panel.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
  };

  const removePanelListeners = () => {
    const panel = panelRef.current;
    if (!panel) return;
    try {
      panel.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    } catch (e) { }
    if (panel) panel.style.transform = "";
    dragState.current = { active: false, startY: 0, lastY: 0, currentTranslate: 0 };
  };

  const onPointerDown = (ev) => {
    dragState.current.active = true;
    dragState.current.startY = ev.clientY;
    dragState.current.lastY = ev.clientY;
    dragState.current.currentTranslate = 0;
  };

  const onPointerMove = (ev) => {
    if (!dragState.current.active) return;
    ev.preventDefault();
    const dy = ev.clientY - dragState.current.startY;
    if (dy < 0) return; // only downward drags
    const panel = panelRef.current;
    const max = window.innerHeight * 0.9;
    const eased = dy * 0.9;
    dragState.current.lastY = ev.clientY;
    dragState.current.currentTranslate = Math.min(eased, max);
    if (panel) panel.style.transform = `translateY(${dragState.current.currentTranslate}px)`;
  };

  const onPointerUp = () => {
    if (!dragState.current.active) return;
    const moved = dragState.current.currentTranslate;
    const threshold = Math.max(96, window.innerHeight * 0.12);
    const panel = panelRef.current;
    dragState.current.active = false;
    dragState.current.startY = 0;
    dragState.current.lastY = 0;
    dragState.current.currentTranslate = 0;

    if (moved > threshold) {
      if (panel) panel.style.transform = "";
      setMobileOpen(false);
    } else {
      if (!panel) return;
      panel.style.transition = "transform 260ms cubic-bezier(.22,1,.36,1)";
      panel.style.transform = "translateY(0)";
      setTimeout(() => {
        if (panel) panel.style.transition = "";
      }, 300);
    }
  };

  /* ---------------- Desktop & Mobile pill movement (same approach) ---------------- */
  const setWidthInstant = (pill, widthPx) => {
    if (!pill) return;
    const prev = pill.style.transition || "";
    pill.style.transition = "none";
    pill.style.width = `${widthPx}px`;
    void pill.offsetWidth;
    pill.style.transition = prev;
  };

  const movePillToActive = (immediate = false) => {
    const dock = dockRef.current;
    const pill = pillRef.current;
    if (!dock || !pill) return;
    const activeEl = dock.querySelector(".dock-item.active") || dock.querySelector(".dock-item");
    if (!activeEl) return;
    const activeRect = activeEl.getBoundingClientRect();
    const dockRect = dock.getBoundingClientRect();
    const centerX = (activeRect.left + activeRect.right) / 2 - dockRect.left;
    const label = activeEl.querySelector(".dock-label");
    let targetWidth = Math.max(activeRect.width, 54);
    if (label) {
      const labelWidth = label.offsetWidth || 0;
      targetWidth = Math.max(labelWidth + 36, 54);
    }
    setWidthInstant(pill, targetWidth);
    if (immediate) {
      pill.style.transition = "none";
      pill.style.left = `${centerX}px`;
      void pill.offsetWidth;
      pill.style.transition = "";
      pill.classList.remove("pop");
      return;
    }
    pill.classList.remove("pop");
    if (mobilePopTimeoutRef.current) clearTimeout(mobilePopTimeoutRef.current);
    requestAnimationFrame(() => {
      pill.style.left = `${centerX}px`;
      requestAnimationFrame(() => {
        const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!prefersReduced) {
          pill.classList.add("pop");
          mobilePopTimeoutRef.current = setTimeout(() => pill.classList.remove("pop"), 520);
        }
      });
    });
  };

  const moveDesktopPillToActive = (immediate = false) => {
    const ul = ulRef.current;
    const pill = desktopPillRef.current;
    if (!ul || !pill) return;
    const activeLi = ul.querySelector("li.active") || ul.querySelector("li");
    if (!activeLi) return;
    const liRect = activeLi.getBoundingClientRect();
    const ulRect = ul.getBoundingClientRect();
    const centerX = (liRect.left + liRect.right) / 2 - ulRect.left;
    const anchor = activeLi.querySelector("a");
    let targetWidth = Math.max(liRect.width, 60);
    if (anchor) {
      const textWidth = anchor.offsetWidth || 0;
      targetWidth = Math.max(textWidth + 48, 60);
    }
    setWidthInstant(pill, targetWidth);
    if (immediate) {
      pill.style.transition = "none";
      pill.style.left = `${centerX}px`;
      void pill.offsetWidth;
      pill.style.transition = "";
      pill.classList.remove("pop");
      return;
    }
    pill.classList.remove("pop");
    if (desktopPopTimeoutRef.current) clearTimeout(desktopPopTimeoutRef.current);
    requestAnimationFrame(() => {
      pill.style.left = `${centerX}px`;
      requestAnimationFrame(() => {
        const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!prefersReduced) {
          pill.classList.add("pop");
          desktopPopTimeoutRef.current = setTimeout(() => pill.classList.remove("pop"), 520);
        }
      });
    });
  };

  /* ---------------- Init: inject pills and observers ---------------- */
  useEffect(() => {
    const ul = ulRef.current;
    const dock = dockRef.current;
    if (ul) ul.classList.add("no-anim");

    if (dock) {
      let pill = dock.querySelector(".active-pill");
      if (!pill) {
        pill = document.createElement("div");
        pill.className = "active-pill";
        dock.appendChild(pill);
      }
      pillRef.current = pill;
      movePillToActive(true);
      const ro = new ResizeObserver(() => movePillToActive(true));
      dock.querySelectorAll(".dock-label").forEach((lbl) => ro.observe(lbl));
    }

    if (ul) {
      let dPill = ul.querySelector(".desktop-pill");
      if (!dPill) {
        dPill = document.createElement("div");
        dPill.className = "desktop-pill";
        ul.appendChild(dPill);
      }
      desktopPillRef.current = dPill;
      moveDesktopPillToActive(true);

      const ro2 = new ResizeObserver(() => moveDesktopPillToActive(true));
      ul.querySelectorAll("li a").forEach((a) => ro2.observe(a));

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (ul) ul.classList.remove("no-anim");
        });
      });

      let tid2;
      const onResize2 = () => {
        clearTimeout(tid2);
        tid2 = setTimeout(() => {
          movePillToActive(true);
          moveDesktopPillToActive(true);
        }, 60);
      };
      window.addEventListener("resize", onResize2);
      window.addEventListener("orientationchange", onResize2);

      return () => {
        ro2.disconnect();
        window.removeEventListener("resize", onResize2);
        window.removeEventListener("orientationchange", onResize2);
        if (mobilePopTimeoutRef.current) clearTimeout(mobilePopTimeoutRef.current);
        if (desktopPopTimeoutRef.current) clearTimeout(desktopPopTimeoutRef.current);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* whenever activeLink changes, animate pills */
  useEffect(() => {
    movePillToActive(false);
    moveDesktopPillToActive(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLink]);

  /* peek bounce: when menu opens briefly nudge it */
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (mobileOpen) {
      setIsAnimating(true);
      try { if (navigator.vibrate) navigator.vibrate(8); } catch (e) { }
      // add peek class to panel for tiny bounce
      const panel = panelRef.current;
      if (panel) {
        panel.classList.add("peek");
        setTimeout(() => panel.classList.remove("peek"), 520);
      }
      setTimeout(() => setIsAnimating(false), 380);
    } else {
      setIsAnimating(true);
      try { if (navigator.vibrate) navigator.vibrate(6); } catch (e) { }
      setTimeout(() => setIsAnimating(false), 260);
    }
  }, [mobileOpen]);

  /* ---------------- Render ---------------- */
  return (
    <>
      {/* DESKTOP HEADER */}
      <header className="header-list desktop-header" role="navigation">
        <div className="div-list">
          <ul className="ul-list" ref={ulRef}>
            {navItemsAll.map((item) => {
              const isActive = activeLink === item.id;
              return (
                <li key={item.id} className={isActive ? "active" : ""}>
                  <span className="icon-wrapper">
                    <item.Icon size={20} />
                  </span>
                  <a href={`#${item.id}`} onClick={(e) => handleClick(e, item.id)}>
                    {item.text}
                  </a>
                </li>
              );
            })}
            <li>
              <ToggleTheme />
            </li>
          </ul>
        </div>
      </header>

      {/* MOBILE: HAMBURGER + SLIDE PANEL */}
      <div className="mobile-bottom-nav-hamburger" aria-hidden={false}>
        <button
          className={`hamburger-btn ${mobileOpen ? "open" : ""}`}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          type="button"
        >
          <span className={`hamburger-icon ${mobileOpen ? "open" : ""}`} aria-hidden="true" />
        </button>

        <div
          className={`mobile-menu-overlay ${mobileOpen ? "open" : ""}`}
          onClick={() => setMobileOpen(false)}
          role="presentation"
        />

        <div
          className={`mobile-menu-panel ${mobileOpen ? "open" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          ref={panelRef}
        >
          <div className="mobile-menu-inner">
            {/* top drag handle + quick close */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <div className="menu-drag-handle" aria-hidden="true">
                <div className="handle-bar" />
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ width: 10 }} />
                <button
                  type="button"
                  aria-label="Close menu"
                  className="quick-close"
                  onClick={() => setMobileOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Search */}
            <div style={{ padding: "10px 2px 12px 0" }}>
              <label htmlFor="mobile-nav-search" style={{ display: "none" }}>Search menu</label>
              <div className="mobile-search-wrapper">
                <Search size={16} />
                <input
                  id="mobile-nav-search"
                  type="search"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mobile-search-input"
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="mobile-search-clear"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <nav className="mobile-menu-list" aria-label="Primary mobile">
              {/* If no searchTerm, show normal filtered nav items (pages) */}
              {(!searchTerm || searchTerm.trim() === "") && (
                <>
                  {navItemsAll.map((item) => {
                    const isActive = activeLink === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`mobile-menu-item ${isActive ? "active" : ""}`}
                        onClick={(e) => {
                          handleClick(e, item.id);
                          setTimeout(() => setMobileOpen(false), 200);
                        }}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <div className="mobile-icon" aria-hidden="true">
                          <item.Icon size={18} />
                        </div>
                        <div className="mobile-text">{item.text}</div>
                      </button>
                    );
                  })}
                </>
              )}

              {/* If searching: show matching pages + project hits */}
              {searchTerm && searchTerm.trim() !== "" && (
                <>
                  {/* matching pages */}
                  <div style={{ padding: "8px 14px", color: "var(--text-lighter)", fontWeight: 700 }}>Pages</div>
                  {navItemsAll
                    .filter(it => it.text.toLowerCase().includes(searchTerm.trim().toLowerCase()))
                    .map((item) => {
                      const isActive = activeLink === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          className={`mobile-menu-item ${isActive ? "active" : ""}`}
                          onClick={(e) => {
                            handleClick(e, item.id);
                            setTimeout(() => setMobileOpen(false), 200);
                          }}
                        >
                          <div className="mobile-icon" aria-hidden="true">
                            <item.Icon size={18} />
                          </div>
                          <div className="mobile-text">{item.text}</div>
                        </button>
                      );
                    })}

                  {/* project hits */}
                  <div style={{ padding: "8px 14px", color: "var(--text-lighter)", fontWeight: 700, marginTop: 6 }}>Projects</div>

                  {/* Compute projectResults on the fly from projects state */}
                  {(() => {
                    const term = searchTerm.trim().toLowerCase();
                    if (!term) return null;
                    // derive matches client-side (title, category, tags)
                    const hits = projects.filter(p => {
                      const title = (p.title || "").toLowerCase();
                      const category = (p.category || "").toLowerCase();
                      const tagsRaw = p.tags || "";
                      const tags = Array.isArray(tagsRaw) ? tagsRaw.join(" ") : String(tagsRaw);
                      const tagsLower = tags.toLowerCase();
                      return title.includes(term) || category.includes(term) || tagsLower.includes(term);
                    }).slice(0, 8); // limit results

                    if (!hits.length) {
                      return <div style={{ padding: "10px 14px", color: "var(--text-lighter)" }}>No projects found</div>;
                    }

                    return hits.map(p => (
                      <button
                        key={p.id}
                        className="mobile-project-item"
                        onClick={() => {
                          // navigate to project details and close menu
                          navigate(`/project/${p.id}`);
                          setMobileOpen(false);
                          setSearchTerm("");
                        }}
                        type="button"
                      >
                        <div className="mobile-project-thumb">
                          <img src={p.imageUrl || "https://placehold.co/160x100?text=No+Image"} alt={p.title || "Project"} />
                        </div>
                        <div className="mobile-project-meta">
                          <div className="mobile-project-title">{p.title || "Untitled"}</div>
                          <div className="mobile-project-sub">{(p.category || (p.tags && (Array.isArray(p.tags) ? p.tags.join(", ") : p.tags))) || ""}</div>
                        </div>
                      </button>
                    ));
                  })()}
                </>
              )}
            </nav>


            <div className="mobile-menu-footer">
              <div className="footer-theme"><ToggleTheme /></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
