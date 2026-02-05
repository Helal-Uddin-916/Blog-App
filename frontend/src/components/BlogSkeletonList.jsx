import React from "react";
import BlogSkeleton from "./BlogSkeleton";

function BlogSkeletonList({ count = 4 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <BlogSkeleton key={index} />
      ))}
    </>
  );
}

export default BlogSkeletonList;
