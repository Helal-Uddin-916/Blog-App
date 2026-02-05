import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import DisplayBlogs from "./DisplayBlogs";
import BlogSkeletonList from "./BlogSkeletonList";
import usePagination from "../hooks/usePagination";

function Homepage() {
  const [page, setPage] = useState(1);

  useSelector((state) => state.user);

  // ✅ make sure your hook returns loading
  const { blogs, hasMore, loading } = usePagination("blogs", {}, 4, page);

  useEffect(() => {
    setPage(1);
  }, []);

  console.log({
    blogsLength: blogs.length,
    hasMore,
    loading,
    page,
  });

  return (
    <div className="w-full lg:w-[80%] 2xl:w-[60%] mx-auto flex p-5 justify-between">
      {/* LEFT SECTION */}
      <div className="w-full md:w-[65%] md:pr-10">
        {/* Skeleton on first load */}
        {loading && page === 1 ? (
          <BlogSkeletonList count={4} />
        ) : (
          blogs.length > 0 && <DisplayBlogs blogs={blogs} />
        )}

        {/* Skeleton when loading more */}
        {loading && page > 1 && <BlogSkeletonList count={2} />}

        {/* Load More button */}
        {hasMore && !loading && (
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="rounded-3xl bg-blue-500 mx-auto mt-6 block text-white px-7 py-3"
          >
            Load More
          </button>
        )}
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="hidden md:block w-[30%] border-l pl-10 min-h-[calc(100vh-70px)]">
        <h1 className="text-xl font-semibold mb-4">Recommended Topics</h1>

        <div className="flex flex-wrap">
          {["React", "MERN", "Node", "Code", "Thread", "Cars", "Kids"].map(
            (tag, index) => (
              <Link key={index} to={`/tag/${tag}`}>
                <div className="m-1 bg-gray-200 cursor-pointer text-black rounded-full px-5 py-2 hover:text-white hover:bg-blue-600">
                  {tag}
                </div>
              </Link>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export default Homepage;
