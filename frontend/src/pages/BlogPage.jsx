import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  addSelectedBlog,
  changeLikes,
  removeSelectedBlog,
} from "../utils/selectedBlogSlice";
import { setIsOpen } from "../utils/commentSlice";
import Comment from "../components/Comment";
import { formatDate } from "../utils/formatDate";
import BlogPageSkeleton from "../components/BlogPageSkeleton";

/* ---------------- HELPERS ---------------- */

export async function handleSaveBlogs(id, token) {
  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/save-blog/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    toast.success(res.data.message);
  } catch (error) {
    toast.error(error.response?.data?.message || "Error");
  }
}

export async function handleFollowCreator(id, token) {
  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/follow/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    toast.success(res.data.message);
  } catch (error) {
    toast.error(error.response?.data?.message || "Error");
  }
}

/* ---------------- COMPONENT ---------------- */

function BlogPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { token, id: userId, email } = useSelector((state) => state.user);
  const { likes, comments, content } = useSelector(
    (state) => state.currentBlog,
  );
  const { isOpen } = useSelector((state) => state.comment);

  const [blogData, setBlogData] = useState(null);
  const [isLike, setIsLike] = useState(false);

  /* -------- FETCH BLOG -------- */

  async function fetchBlogById() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`,
      );

      const blog = res.data.blogs;

      setBlogData(blog);
      dispatch(addSelectedBlog(blog));

      if (blog.likes.includes(userId)) {
        setIsLike(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  }

  /* -------- LIKE -------- */

  async function handleLike() {
    if (!token) {
      return toast.error("Please sign in to like this blog");
    }

    setIsLike((prev) => !prev);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/like/${blogData._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      dispatch(changeLikes(userId));
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  }

  /* -------- EFFECT -------- */

  useEffect(() => {
    fetchBlogById();

    return () => {
      dispatch(setIsOpen(false));
      dispatch(removeSelectedBlog());
    };
  }, []);

  /* ---------------- UI ---------------- */

  if (!blogData) {
    return <BlogPageSkeleton />;
  }

  const creator = blogData.creator;

  return (
    <div className="max-w-[750px] mx-auto p-5">
      <h1 className="mt-10 font-bold text-3xl sm:text-4xl lg:text-6xl capitalize">
        {blogData.title}
      </h1>

      {/* ---------- AUTHOR ---------- */}
      <div className="flex items-center my-5 gap-3">
        <Link to={`/@${creator.username}`}>
          <div className="w-10 h-10 cursor-pointer">
            <img
              className="w-full h-full rounded-full object-cover"
              src={
                creator.profilePic
                  ? creator.profilePic
                  : `https://api.dicebear.com/9.x/micah/svg?seed=${creator.name}`
              }
              alt={creator.name}
            />
          </div>
        </Link>

        <div>
          <div className="flex items-center gap-2">
            <Link to={`/@${creator.username}`}>
              <h2 className="text-xl hover:underline cursor-pointer">
                {creator.name}
              </h2>
            </Link>

            {creator._id !== userId && (
              <span
                onClick={() => handleFollowCreator(creator._id, token)}
                className="text-green-700 cursor-pointer font-medium"
              >
                {!creator.followers?.includes(userId) ? "Follow" : "Following"}
              </span>
            )}
          </div>

          <div className="text-sm opacity-70">
            <span>6 min read</span>
            <span className="mx-2">{formatDate(blogData.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* ---------- IMAGE ---------- */}
      <img src={blogData.image} alt="" className="rounded-lg" />

      <p className="my-10 text-2xl">{blogData.description}</p>

      {/* ---------- EDIT ---------- */}
      {token && email === creator.email && (
        <Link to={`/edit-blog/${blogData.blogId}`}>
          <button className="bg-green-400 mt-5 px-6 py-2 text-xl rounded">
            Edit
          </button>
        </Link>
      )}

      {/* ---------- ACTIONS ---------- */}
      <div className="flex gap-7 mt-6">
        <div className="flex gap-2 cursor-pointer">
          <i
            onClick={handleLike}
            className={`fi text-3xl ${
              isLike ? "fi-sr-thumbs-up text-blue-600" : "fi-rr-social-network"
            }`}
          ></i>
          <p className="text-2xl">{likes.length}</p>
        </div>

        <div className="flex gap-2 cursor-pointer">
          <i
            onClick={() => dispatch(setIsOpen())}
            className="fi fi-sr-comment-alt text-3xl"
          ></i>
          <p className="text-2xl">{comments.length}</p>
        </div>

        <div
          className="flex gap-2 cursor-pointer"
          onClick={() => handleSaveBlogs(blogData._id, token)}
        >
          <i
            className={`fi text-3xl ${
              blogData.totalSaves?.includes(userId)
                ? "fi-sr-bookmark"
                : "fi-rr-bookmark"
            }`}
          ></i>
        </div>
      </div>

      {/* ---------- CONTENT ---------- */}
      <div className="my-10">
        {content.blocks.map((block, index) => {
          if (block.type === "header") {
            const Tag = `h${block.data.level}`;
            return (
              <Tag
                key={index}
                className="font-bold my-4"
                dangerouslySetInnerHTML={{ __html: block.data.text }}
              />
            );
          }

          if (block.type === "paragraph") {
            return (
              <p
                key={index}
                dangerouslySetInnerHTML={{ __html: block.data.text }}
              />
            );
          }

          if (block.type === "image") {
            return (
              <div key={index} className="my-4">
                <img src={block.data.file.url} alt="" />
                {block.data.caption && (
                  <p className="text-center my-2">{block.data.caption}</p>
                )}
              </div>
            );
          }

          return null;
        })}
      </div>

      {isOpen && <Comment />}
    </div>
  );
}

export default BlogPage;
