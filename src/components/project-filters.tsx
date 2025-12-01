import { Search, Grid3x3, List, ArrowUpDown } from "lucide-react";

interface ProjectFiltersProps {
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    sortBy: string;
    onSortChange: (sort: string) => void;
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function ProjectFilters({
    categories,
    selectedCategory,
    onCategoryChange,
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    viewMode,
    onViewModeChange
}: ProjectFiltersProps) {
    return (
        <div className="mb-10 space-y-6">
            {/* Search Bar and Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    />
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                    <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="appearance-none pl-12 pr-10 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent cursor-pointer min-w-[180px]"
                    >
                        <option value="recent">Most Recent</option>
                        <option value="oldest">Oldest First</option>
                        <option value="title">Title (A-Z)</option>
                        <option value="category">Category</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex gap-2 bg-white border border-neutral-200 rounded-lg p-1">
                    <button
                        onClick={() => onViewModeChange('grid')}
                        className={`p-2 rounded transition-colors ${viewMode === 'grid'
                                ? 'bg-neutral-900 text-white'
                                : 'text-neutral-600 hover:text-neutral-900'
                            }`}
                        aria-label="Grid view"
                    >
                        <Grid3x3 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onViewModeChange('list')}
                        className={`p-2 rounded transition-colors ${viewMode === 'list'
                                ? 'bg-neutral-900 text-white'
                                : 'text-neutral-600 hover:text-neutral-900'
                            }`}
                        aria-label="List view"
                    >
                        <List className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => onCategoryChange(category)}
                        className={`px-5 py-2 rounded-full transition-colors ${selectedCategory === category
                                ? 'bg-neutral-900 text-white'
                                : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-900'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
}