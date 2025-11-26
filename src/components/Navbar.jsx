import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToggleTheme } from "./ToggleTheme";
import { House, User, FolderOpen, Code, Mail } from "lucide-react";
import { useScroll } from "../contexts/ScrollContext";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();

  const dockRef = useRef(null);         // mobile dock
  const pillRef = useRef(null);         // mobile pill
  const ulRef = useRef(null);           // desktop UL
  const desktopPillRef = useRef(null);  // desktop pill

  const autoScrollRef = useRef(false);      // flag used to ignore scroll-spy while we are programmatically scrolling
  const autoScrollTimerRef = useRef(null);  // timer id for releasing the lock
  const mobilePopTimeoutRef = useRef(null); // mobile pop timeout
  const desktopPopTimeoutRef = useRef(null);// desktop pop timeout

  const navItems = [
    { id: "home", Icon: House, text: "Home" },
    { id: "about", Icon: User, text: "About" },
    { id: "project", Icon: FolderOpen, text: "Projects" },
    { id: "skills", Icon: Code, text: "Skills" },
    { id: "contact", Icon: Mail, text: "Contact" }
  ];

  /* ---------------- SCROLL SPY (ignores while autoScrollRef.current is true) ---------------- */
  useEffect(() => {
    if (location.pathname === "/all-projects") {
      setActiveLink("project");
      return;
    }
    const handleScroll = () => {
      // ignore scroll spy while we're in auto-scroll (prevents pill jump/return)
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
    // initialize
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  /* ---------------- SMOOTH SCROLL HELPER (do NOT set activeLink here) ---------------- */
  const { lenis } = useScroll();

  const scrollToSection = (id) => {
    if (!id) return;
    const offset = 20;
    const maxAttempts = 6;
    const retryDelay = 180;

    // If Lenis is active (desktop), use it for smooth scrolling
    if (lenis) {
      const element = document.getElementById(id);
      if (element) {
        lenis.scrollTo(element, { offset: -offset, duration: 1.2 });
      }
      return;
    }

    let attempt = 0;
    const findElement = () => {
      const selectors = [
        `#${id}`,
        `#${id}s`,
        `section#${id}`,
        `section#${id}s`,
        `[data-section="${id}"]`,
        `[data-section="${id}s"]`,
        `[name="${id}"]`,
        `[name="${id}s"]`,
        `.${id}`
      ];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) return el;
      }
      return null;
    };

    const tryScroll = () => {
      attempt++;
      const element = findElement();
      // debug output (remove if you don't want logs)
      // console.log('[nav] tryScroll', id, 'attempt', attempt, '->', !!element);

      if (!element) {
        if (attempt < maxAttempts) {
          setTimeout(tryScroll, retryDelay);
        }
        return;
      }

      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        window.scrollBy({ top: -offset, left: 0, behavior: "smooth" });
      }, 60);
    };

    tryScroll();
  };

  /* ---------------- HANDLE CLICK: set active immediately and start auto-scroll lock ---------------- */
  const handleClick = (e, id) => {
    e && e.preventDefault && e.preventDefault();

    // immediate visual update for pill
    setActiveLink(id);

    // Lock scroll-spy while we perform programmatic scrolls
    autoScrollRef.current = true;
    if (autoScrollTimerRef.current) clearTimeout(autoScrollTimerRef.current);
    autoScrollTimerRef.current = setTimeout(() => {
      autoScrollRef.current = false;
      autoScrollTimerRef.current = null;
    }, 900);

    if (location.pathname !== "/") {
      // navigate to homepage then try scrolling after a short delay
      navigate("/");
      // give slightly more time to render the homepage DOM before starting retries
      setTimeout(() => scrollToSection(id), 320);
    } else {
      // on homepage — scroll immediately
      scrollToSection(id);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.currentTarget.click();
    }
  };

  /* ---------------- Helper to set width instantly (avoid animating width) ---------------- */
  const setWidthInstant = (pill, widthPx) => {
    if (!pill) return;
    const prev = pill.style.transition || "";
    pill.style.transition = "none";
    pill.style.width = `${widthPx}px`;
    void pill.offsetWidth;
    pill.style.transition = prev;
  };

  /* ---------------- MOBILE pill movement (set width instantly, animate left) ---------------- */
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

  /* ---------------- DESKTOP pill movement (width instant, animate left only) ---------------- */
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

  /* ---------------- INIT: create/inject pills, set initial positions, observers ---------------- */
  useEffect(() => {
    const ul = ulRef.current;
    const dock = dockRef.current;

    if (ul) ul.classList.add("no-anim");

    // observers stored so we can disconnect in cleanup
    let mobileRO = null;
    let desktopRO = null;

    // MOBILE pill init
    if (dock) {
      let pill = dock.querySelector(".active-pill");
      if (!pill) {
        pill = document.createElement("div");
        pill.className = "active-pill";
        dock.appendChild(pill);
      }
      pillRef.current = pill;
      movePillToActive(true);

      mobileRO = new ResizeObserver(() => movePillToActive(true));
      dock.querySelectorAll(".dock-label").forEach((lbl) => mobileRO.observe(lbl));
    }

    // DESKTOP pill init
    if (ul) {
      let dPill = ul.querySelector(".desktop-pill");
      if (!dPill) {
        dPill = document.createElement("div");
        dPill.className = "desktop-pill";
        ul.appendChild(dPill);
      }
      desktopPillRef.current = dPill;
      moveDesktopPillToActive(true);

      desktopRO = new ResizeObserver(() => moveDesktopPillToActive(true));
      ul.querySelectorAll("li a").forEach((a) => desktopRO.observe(a));

      // re-enable li animation after two RAF ticks (ensures pill placement has happened)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (ul) ul.classList.remove("no-anim");
        });
      });

      // reposition pills on resize/orientation
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

      // cleanup for desktop branch
      return () => {
        if (desktopRO) desktopRO.disconnect();
        window.removeEventListener("resize", onResize2);
        window.removeEventListener("orientationchange", onResize2);
        if (mobilePopTimeoutRef.current) clearTimeout(mobilePopTimeoutRef.current);
        if (desktopPopTimeoutRef.current) clearTimeout(desktopPopTimeoutRef.current);
      };
    }

    // cleanup if desktop branch didn't run (disconnect mobile observer etc.)
    return () => {
      if (mobileRO) mobileRO.disconnect();
      if (mobilePopTimeoutRef.current) clearTimeout(mobilePopTimeoutRef.current);
      if (desktopPopTimeoutRef.current) clearTimeout(desktopPopTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- whenever activeLink changes, animate pills ---------------- */
  useEffect(() => {
    movePillToActive(false);
    moveDesktopPillToActive(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLink]);

  /* cleanup timers on unmount */
  useEffect(() => {
    return () => {
      if (autoScrollTimerRef.current) clearTimeout(autoScrollTimerRef.current);
      if (mobilePopTimeoutRef.current) clearTimeout(mobilePopTimeoutRef.current);
      if (desktopPopTimeoutRef.current) clearTimeout(desktopPopTimeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* DESKTOP HEADER */}
      <header className="header-list desktop-header" role="navigation">
        <div className="div-list">
          <ul className="ul-list" ref={ulRef}>
            {navItems.map((item) => {
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

      {/* MOBILE BOTTOM NAV */}
      <div className="mobile-bottom-nav">
        <nav className="glass-dock" ref={dockRef}>
          {navItems.map((item) => {
            const isActive = activeLink === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`dock-item ${isActive ? "active" : ""}`}
                onClick={(e) => handleClick(e, item.id)}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                aria-current={isActive ? "page" : undefined}
                role="link"
                style={{ position: "relative", isolation: "isolate" }}
              >
                <div className="icon-container" style={{ position: "relative", zIndex: 20 }}>
                  <item.Icon size={20} />
                </div>
                <span className="dock-label" style={{ position: "relative", zIndex: 20 }}>
                  {item.text}
                </span>
              </a>
            );
          })}

          <div className="dock-item theme-item" tabIndex={-1}>
            <ToggleTheme />
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
