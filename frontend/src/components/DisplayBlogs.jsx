import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { useSelector } from "react-redux";
import { handleSaveBlogs } from "../pages/BlogPage";

function DisplayBlogs({ blogs }) {
  const { token, id: userId } = useSelector((state) => state.user);
  return (
    <div>
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <Link to={`/blog/${blog.blogId}`}>
            <div key={blog._id} className="w-full my-10 flex justify-between">
              <div className="w-[60%] flex flex-col gap-2">
                <div>
                  <img src="" alt="" />
                  <p>{blog.creator.name}</p>
                </div>
                <h2 className="font-bold text-xl sm:text-2xl">{blog.title}</h2>
                <h4 className="line-clamp-2">{blog.description}</h4>
                <div className="flex gap-5">
                  <p>{formatDate(blog.createdAt)}</p>
                  <div className="flex gap-7">
                    <div className="cursor-pointer flex gap-2">
                      <i className="fi text-lg mt-1 fi-rr-social-network"></i>
                      <p className="text-lg">{blog.likes.length}</p>
                    </div>
                    <div className="flex gap-2">
                      <i className="fi text-lg mt-1 fi-sr-comment-alt"></i>
                      <p className="text-lg">{blog.comments.length}</p>
                    </div>
                    <div
                      className="flex gap-2"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSaveBlogs(blog._id, token);
                      }}
                    >
                      {blog?.totalSaves?.includes(userId) ? (
                        <i className="fi text-lg mt-1 fi-sr-bookmark"></i>
                      ) : (
                        <i className="fi text-lg mt-1 fi-rr-bookmark"></i>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[40%] sm:w-[30%]">
                <img className="w-40" src={blog.image} alt="" />
              </div>
            </div>
          </Link>
        ))
      ) : (
        <h1 className="my-10 text-2xl font-semibold">No Data Found</h1>
      )}
    </div>
  );
}

export default DisplayBlogs;
