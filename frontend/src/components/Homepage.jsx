import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { handleSaveBlogs } from "../pages/BlogPage";
import { useSelector } from "react-redux";
import DisplayBlogs from "./DisplayBlogs";
import usePagination from "../hooks/usePagination";

function Homepage() {
  const [page, setPage] = useState(1);

  useSelector((state) => state.user);
  const { blogs, hashMore } = usePagination("blogs", {}, 4, page);
  return (
    <div className="w-full lg:w-[80%] 2xl-w-[60%] mx-auto flex p-5 justify-between">
      <div className="w-full md:w-[65%] md:pr-10">
        {blogs.length > 0 && <DisplayBlogs blogs={blogs} />}
        {hashMore && (
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="rounded-3xl bg-blue-500 mx-auto text-white px-7 py-3"
          >
            Load More
          </button>
        )}
      </div>
      <div className="hidden md:block w-[30%] border-l pl-10 min-h-[calc(100vh-70px)]">
        <div>
          <h1 className="text-xl font-semibold mb-4">Recommended Topics</h1>
          <div className="flex flex-wrap">
            {[
              "React",
              "mERN",
              "nODE",
              "code",
              "thread",
              "Fuck",
              "car",
              "kids",
            ].map((tag, index) => (
              <Link to={`/tag/${tag}`}>
                <div
                  key={index}
                  className="m-1 bg-gray-200 cursor-pointer text-black rounded-full px-5 py-2 flex justify-center items-center hover:text-white hover:bg-blue-600"
                >
                  <p>{tag}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
