import React from 'react';
import Skeleton from './Skeleton';

const RoomCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 flex flex-col h-full">
      {/* Image Skeleton */}
      <div className="h-72 w-full relative">
        <Skeleton className="h-full w-full rounded-none" variant="rectangular" />
      </div>

      {/* Content Skeleton */}
      <div className="p-6 flex flex-col flex-grow space-y-4">
        {/* Title and Badge */}
        <div className="flex justify-between items-start gap-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Features */}
        <div className="flex gap-4">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>

        {/* Amenities */}
        <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-12 rounded-full" />
        </div>

        {/* Price and Button */}
        <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center">
            <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-12 w-36 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default RoomCardSkeleton;
