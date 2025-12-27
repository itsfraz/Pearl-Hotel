import React from 'react';
import Skeleton from './Skeleton';

const RoomDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-surface-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
            <Skeleton className="h-10 w-32 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-10">
             {/* Main Image */}
             <div className="space-y-4">
                 <Skeleton className="w-full aspect-video rounded-3xl" variant="rectangular" />
                 <div className="grid grid-cols-4 gap-4">
                     {[1,2,3,4].map(i => <Skeleton key={i} className="aspect-video rounded-xl" variant="rectangular" />)}
                 </div>
             </div>

             {/* Info */}
             <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
                 <div className="flex justify-between items-start">
                     <div className="space-y-2 w-1/2">
                         <Skeleton className="h-10 w-3/4" />
                         <Skeleton className="h-6 w-1/3 rounded-full" />
                     </div>
                     <div className="w-1/4">
                         <Skeleton className="h-10 w-full" />
                     </div>
                 </div>

                 <div className="space-y-2">
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-2/3" />
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-surface-50 rounded-2xl border border-slate-100">
                     {[1,2,3,4].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                 </div>
             </div>
          </div>

          {/* Right Column (Booking Card) */}
          <div className="lg:col-span-4">
              <div className="sticky top-28 bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-6">
                  <div className="text-center space-y-2">
                      <Skeleton className="h-4 w-1/2 mx-auto" />
                      <Skeleton className="h-10 w-1/3 mx-auto" />
                  </div>
                  <div className="space-y-4">
                      <Skeleton className="h-14 w-full rounded-xl" />
                      <Skeleton className="h-14 w-full rounded-xl" />
                  </div>
                  <div className="pt-4">
                      <Skeleton className="h-14 w-full rounded-xl" />
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsSkeleton;
