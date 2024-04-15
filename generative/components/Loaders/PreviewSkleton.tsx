import React from 'react';

const PreviewSkelton: React.FC = () => {
  return (
    <div className="max-w-full mx-auto p-8">
      {/* Title Skeleton */}
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200/50 w-3/4 mb-4"></div>
      </div>

      {/* Author & Date Skeleton */}
      <div className="flex items-center justify-between mb-4 animate-pulse">
        <div className="flex space-x-4">
          <div className="h-4 bg-gray-200/50 w-full"></div>
          <div className="h-4 bg-gray-200/50 w-full"></div>
        </div>
        <div className="h-4 bg-gray-200/50 w-20"></div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4 animate-pulse">
        <div className="h-11 bg-gray-200/50 w-full"></div>
        <div className="h-72 bg-gray-200/50 w-full"></div>
        <div className="h-4 bg-gray-200/50 w-3/4"></div>
        <div className="h-4 bg-gray-200/50 w-1/2"></div>
      </div>
    </div>
  );
};

export default PreviewSkelton;
