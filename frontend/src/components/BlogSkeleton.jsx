import React from "react";

function BlogSkeleton() {
  return (
    <div className="animate-pulse border-b py-6">
      {/* Author */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
        <div className="h-4 w-32 bg-gray-300 rounded" />
      </div>

      {/* Title */}
      <div className="h-6 w-3/4 bg-gray-300 rounded mb-3" />

      {/* Content */}
      <div className="h-4 w-full bg-gray-200 rounded mb-2" />
      <div className="h-4 w-5/6 bg-gray-200 rounded mb-4" />

      {/* Footer */}
      <div className="flex gap-4">
        <div className="h-3 w-20 bg-gray-300 rounded" />
        <div className="h-3 w-20 bg-gray-300 rounded" />
      </div>
    </div>
  );
}

export default BlogSkeleton;
