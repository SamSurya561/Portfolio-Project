interface ProjectCardSkeletonProps {
    viewMode?: 'grid' | 'list';
}

export function ProjectCardSkeleton({ viewMode = 'grid' }: ProjectCardSkeletonProps) {
    if (viewMode === 'list') {
        return (
            <div className="bg-white rounded-lg overflow-hidden border border-neutral-200 h-[280px] animate-pulse">
                <div className="flex flex-col sm:flex-row h-full">
                    {/* Image Skeleton */}
                    <div className="relative sm:w-80 w-full h-48 sm:h-full bg-neutral-200 flex-shrink-0" />

                    {/* Content Skeleton */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                            <div className="h-6 bg-neutral-200 rounded w-3/4 mb-2" />
                            <div className="h-4 bg-neutral-200 rounded w-full mb-2" />
                            <div className="h-4 bg-neutral-200 rounded w-5/6" />
                        </div>

                        <div className="space-y-3">
                            <div className="h-8 bg-neutral-200 rounded-full w-24" />
                            <div className="flex gap-2">
                                <div className="h-7 bg-neutral-200 rounded-full w-20" />
                                <div className="h-7 bg-neutral-200 rounded-full w-16" />
                                <div className="h-7 bg-neutral-200 rounded-full w-20" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl overflow-hidden border-2 border-blue-500/20 shadow-md animate-pulse">
            {/* Image Skeleton */}
            <div className="relative aspect-[4/3] bg-neutral-200" />

            {/* Content Skeleton */}
            <div className="p-6 space-y-3">
                <div className="h-6 bg-neutral-200 rounded w-3/4" />
                <div className="h-4 bg-neutral-200 rounded w-full" />
                <div className="h-4 bg-neutral-200 rounded w-5/6" />

                <div className="h-8 bg-neutral-200 rounded-full w-24 mt-4" />

                <div className="flex flex-wrap gap-2 pt-2">
                    <div className="h-7 bg-neutral-200 rounded-full w-20" />
                    <div className="h-7 bg-neutral-200 rounded-full w-16" />
                    <div className="h-7 bg-neutral-200 rounded-full w-20" />
                </div>

                <div className="h-12 bg-neutral-200 rounded-lg w-full mt-4" />
            </div>
        </div>
    );
}
