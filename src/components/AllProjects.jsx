// src/pages/AllProjects.jsx
import React, { useEffect, useState } from "react";

/* Use the Project components you uploaded (adjust paths if needed) */
import ProjectCard from "../components/project-card";
import ProjectCardSkeleton from "../components/project-card-skeleton";
import ProjectFilters from "../components/project-filters";

import "../globals.css"; // uses variables & radii from the ZIP. (you uploaded globals.css). :contentReference[oaicite:6]{index=6}
import "../AllProjects.css";   // tailwind-like utilities & base. :contentReference[oaicite:7]{index=7}

/* ---------- MOCK DATA (copied from your App.tsx) ---------- */
/* If you plan to use Firestore later, I can switch to onSnapshot. */
const MOCK_PROJECTS = [
  {
    id: "1",
    title: "FinFlow Mobile Banking App",
    category: "UI/UX Design",
    description: "A comprehensive mobile banking solution with intuitive navigation and seamless user experience.",
    image: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=1080&q=80&auto=format&fit=crop",
    tags: ["Mobile", "Finance", "iOS"],
    year: "2024"
  },
  {
    id: "2",
    title: "Urban Threads Brand Identity",
    category: "Branding",
    description: "Complete brand identity design for a sustainable fashion startup, including logo, colors, and guidelines.",
    image: "https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=1080&q=80&auto=format&fit=crop",
    tags: ["Branding", "Fashion", "Logo Design"],
    year: "2024"
  },
  {
    id: "3",
    title: "TaskFlow SaaS Platform",
    category: "UI/UX Design",
    description: "Modern web application for project management with focus on collaboration and productivity.",
    image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=1080&q=80&auto=format&fit=crop",
    tags: ["Web Design", "SaaS", "Dashboard"],
    year: "2023"
  },
  {
    id: "4",
    title: "Summer Jazz Festival 2024",
    category: "Graphic Design",
    description: "Vibrant poster series and promotional materials for an annual music festival.",
    image: "https://images.unsplash.com/photo-1654865433650-23e71f161b64?w=1080&q=80&auto=format&fit=crop",
    tags: ["Print", "Event", "Poster"],
    year: "2024"
  },
  {
    id: "5",
    title: "Analytics Pro Dashboard",
    category: "UI/UX Design",
    description: "Data visualization dashboard with real-time analytics and customizable widgets.",
    image: "https://images.unsplash.com/photo-1575388902449-6bca946ad549?w=1080&q=80&auto=format&fit=crop",
    tags: ["Dashboard", "Data Viz", "B2B"],
    year: "2023"
  },
  {
    id: "6",
    title: "Zenith Wellness App",
    category: "UI/UX Design",
    description: "Minimalist meditation and wellness app focused on mental health and mindfulness.",
    image: "https://images.unsplash.com/photo-1655255201488-766303d720a2?w=1080&q=80&auto=format&fit=crop",
    tags: ["Mobile", "Wellness", "Minimalist"],
    year: "2024"
  }
];

export default function AllProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // UI state for filters (mirrors your App.tsx controls)
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // Simulate load (so skeletons show like in the screenshot)
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => {
      setProjects(MOCK_PROJECTS);
      setIsLoading(false);
    }, 700); // quick shimmer then show
    return () => clearTimeout(t);
  }, []);

  // derive categories
  const categories = ["All", ...Array.from(new Set(MOCK_PROJECTS.map(p => p.category)))];

  // client-side filter + sort (same behaviour as your App.tsx)
  const filtered = projects.filter(p => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q || p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const sorted = filtered.slice().sort((a, b) => {
    if (sortBy === "recent") return (b.year || "").localeCompare(a.year || "");
    if (sortBy === "oldest") return (a.year || "").localeCompare(b.year || "");
    if (sortBy === "title") return (a.title || "").localeCompare(b.title || "");
    return 0;
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header (identical to your Figma/ZIP hero) */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 text-center">
          <h1 className="text-neutral-900 mb-2 text-[36px]">Projects</h1>
          <p className="text-neutral-600">
            A collection of my recent work in UI/UX design, branding, and graphic design
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ProjectFilters — uses your exact filter UI from the ZIP. */}
        <ProjectFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <div className="mb-8">
          <p className="text-neutral-600">
            Showing {sorted.length} {sorted.length === 1 ? 'project' : 'projects'}
          </p>
        </div>

        {/* Grid / List body - reuses ProjectCard & Skeleton components you uploaded */}
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-6"}>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} viewMode={viewMode} />
            ))
          ) : sorted.length > 0 ? (
            sorted.map((p, idx) => (
              <ProjectCard key={p.id} project={p} viewMode={viewMode} index={idx} />
            ))
          ) : (
            <div className="text-center py-16">
              <p className="text-neutral-500">No projects found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
