import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { Calendar } from "lucide-react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import "./ScrollTimeline.css";

const DEFAULT_EVENTS = [
  {
    year: "2023",
    title: "Major Achievement",
    subtitle: "Organization Name",
    description:
      "Description of the achievement or milestone reached during this time period.",
  },
  {
    year: "2022",
    title: "Important Milestone",
    subtitle: "Organization Name",
    description: "Details about this significant milestone and its impact.",
  },
  {
    year: "2021",
    title: "Key Event",
    subtitle: "Organization Name",
    description: "Information about this key event in the timeline.",
  },
];

export const ScrollTimeline = ({
  events = DEFAULT_EVENTS,
  title = "Career Timeline",
  subtitle = "Scroll to explore my journey",
}) => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const [fetchedEvents, setFetchedEvents] = useState([]);

  useEffect(() => {
    // Subscribe to the "experience" collection
    const q = query(collection(db, "experience"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFetchedEvents(eventsData);
    });
    return () => unsubscribe();
  }, []);

  // Use fetched events if available, otherwise default
  const displayEvents = fetchedEvents.length > 0 ? fetchedEvents : events;

  // Track scroll progress relative to the component
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start center", "end center"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Map progress 0-1 to 0-100% for the beam height
  const progressHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      // Calculate active index based on scroll position
      const newIndex = Math.floor(v * displayEvents.length);
      if (
        newIndex !== activeIndex &&
        newIndex >= 0 &&
        newIndex < displayEvents.length
      ) {
        setActiveIndex(newIndex);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, displayEvents.length, activeIndex]);

  return (
    <div ref={scrollRef} className="timeline-wrapper" style={{ position: 'relative' }}>
      <div className="timeline-header">
        <h2 className="timeline-title">{title}</h2>
        <p className="timeline-subtitle">{subtitle}</p>
      </div>

      <div className="timeline-content-area">
        {/* 1. Background Line (Static) */}
        <div className="timeline-line-bg"></div>

        {/* 2. Active Glowing Line (Animated) */}
        <motion.div
          className="timeline-line-active"
          style={{ height: progressHeight }}
        />

        {/* 3. Glowing Head/Tip (Animated) */}
        <motion.div
          className="timeline-beam-head"
          style={{ top: progressHeight }}
        >
          {/* Optional: Add a pulsing inner dot or effect if needed */}
        </motion.div>

        {/* Events List */}
        <div className="timeline-items">
          {displayEvents.map((event, index) => {
            return (
              <motion.div
                key={index}
                className="timeline-row"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Card Content */}
                <div className="timeline-card">
                  <div className="card-date">
                    <Calendar size={16} />
                    <span>{event.year}</span>
                  </div>
                  <h3 className="card-title">{event.title}</h3>
                  {event.subtitle && (
                    <div className="card-subtitle">{event.subtitle}</div>
                  )}
                  <p className="card-description">{event.description}</p>
                </div>

                {/* Center Dot */}
                <div className={`timeline-dot ${index <= activeIndex ? "active" : ""}`}></div>

                {/* Spacer for alternating layout */}
                <div className="timeline-spacer"></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
