import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { Project } from "../App";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface ProjectCardProps {
    project: Project;
    viewMode?: 'grid' | 'list';
    index?: number;
}

export function ProjectCard({ project, viewMode = 'grid', index = 0 }: ProjectCardProps) {
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '50px',
            }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, []);

    if (viewMode === 'list') {
        return (
            <motion.div
                ref={cardRef}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer bg-white rounded-lg overflow-hidden border border-neutral-200 hover:shadow-lg transition-shadow h-[280px]"
            >
                <div className="flex flex-col sm:flex-row h-full">
                    {/* Image Container */}
                    <div className="relative sm:w-80 w-full h-48 sm:h-full bg-neutral-200 flex-shrink-0">
                        <ImageWithFallback
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Year Badge */}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                            <span className="text-neutral-900">{project.year}</span>
                        </div>
                    </div>

                    {/* Project Info */}
                    <div className="p-6 flex-1 flex flex-col justify-between min-h-0">
                        <div className="min-h-0 overflow-hidden">
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <h3 className="text-neutral-900 flex-1 line-clamp-2">
                                    {project.title}
                                </h3>
                                <ArrowUpRight className="w-5 h-5 text-neutral-400 group-hover:text-neutral-900 transition-colors flex-shrink-0" />
                            </div>

                            <p className="text-neutral-600 mb-4 line-clamp-2">
                                {project.description}
                            </p>
                        </div>

                        <div className="space-y-3 flex-shrink-0">
                            {/* Category */}
                            <div className="inline-block px-3 py-1 bg-neutral-900 text-white rounded-full">
                                <span>{project.category}</span>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, filter: 'blur(10px)', y: 40 }}
            animate={isVisible ? { opacity: 1, filter: 'blur(0px)', y: 0 } : { opacity: 0, filter: 'blur(10px)', y: 40 }}
            transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1]
            }}
            className="group cursor-pointer bg-white rounded-xl overflow-hidden border-2 border-blue-500/20 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] bg-neutral-200 overflow-hidden">
                <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex items-center gap-2 text-white bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/40">
                            <span>View Project</span>
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Year Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                    <span className="text-neutral-900">{project.year}</span>
                </div>
            </div>

            {/* Project Info */}
            <div className="p-6 space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-neutral-900 flex-1 group-hover:text-blue-600 transition-colors duration-300">
                        {project.title}
                    </h3>
                </div>

                <p className="text-neutral-600 mb-3 line-clamp-2">
                    {project.description}
                </p>

                {/* Category */}
                <div className="inline-block px-3 py-1 bg-neutral-900 text-white rounded-full group-hover:bg-blue-600 transition-colors duration-300">
                    <span>{project.category}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                    {project.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors duration-300"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* View Project CTA Button */}
                <div className="pt-4">
                    <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 group/btn opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                        <span>View Project</span>
                        <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}