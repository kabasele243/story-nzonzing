interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse bg-border rounded ${className}`}
            aria-hidden="true"
        />
    );
}

export function StoryResultSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="p-6 border border-border rounded-lg bg-card-bg">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <Skeleton className="h-8 w-3/4 mb-3" />
                        <div className="flex items-center space-x-6">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Skeleton className="h-10 w-20" />
                        <Skeleton className="h-10 w-28" />
                    </div>
                </div>
                <div className="bg-hover rounded-lg p-4">
                    <Skeleton className="h-5 w-32 mb-3" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i}>
                                <Skeleton className="h-4 w-20 mb-1" />
                                <Skeleton className="h-5 w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="p-6 border border-border rounded-lg bg-card-bg">
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                    ))}
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </div>

            {/* Actions Skeleton */}
            <div className="flex justify-center">
                <Skeleton className="h-12 w-48" />
            </div>
        </div>
    );
}

export function MenuOptionSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border border-border rounded-lg bg-card-bg">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                    </div>
                </div>
            ))}
        </div>
    );
}
