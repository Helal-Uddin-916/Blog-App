import React from "react";

function BlogPageSkeleton() {
  return (
    <div className="max-w-[750px] mx-auto p-5 animate-pulse">
      {/* Title */}
      <div className="h-10 bg-gray-300 rounded w-3/4 mt-10"></div>

      {/* Author */}
      <div className="flex items-center gap-3 my-6">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
          <div className="h-3 w-40 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Blog image */}
      <div className="w-full h-[300px] bg-gray-300 rounded-lg"></div>

      {/* Description */}
      <div className="mt-10 space-y-4">
        <div className="h-5 bg-gray-200 rounded w-full"></div>
        <div className="h-5 bg-gray-200 rounded w-11/12"></div>
        <div className="h-5 bg-gray-200 rounded w-10/12"></div>
      </div>

      {/* Actions */}
      <div className="flex gap-6 mt-8">
        <div className="h-8 w-16 bg-gray-300 rounded"></div>
        <div className="h-8 w-16 bg-gray-300 rounded"></div>
        <div className="h-8 w-8 bg-gray-300 rounded"></div>
      </div>

      {/* Content */}
      <div className="mt-10 space-y-4">
        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-11/12"></div>
        <div className="h-4 bg-gray-200 rounded w-10/12"></div>
      </div>
    </div>
  );
}

export default BlogPageSkeleton;
