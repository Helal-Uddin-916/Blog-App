import React, { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addSelectedBlog,
  changeLikes,
  removeSelectedBlog,
} from "../utils/selectedBlogSlice";
import toast from "react-hot-toast";
import Comment from "../components/Comment";
import { setIsOpen } from "../utils/commentSlice";
import { formatDate } from "../utils/formatDate";
import { updateData } from "../utils/userSlice";

export async function handleSaveBlogs(id, token) {
  try {
    let res = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/save-blog/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success(res.data.message);
    // dispatch(addSelectedBlog(blogs));
  } catch (error) {
    toast.error(error.response.data.message);
  }
}

export async function handleFollowCreator(id, token) {
  try {
    let res = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/follow/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success(res.data.message);
    // dispatch(addSelectedBlog(blogs));
  } catch (error) {
    toast.error(error.response.data.message);
  }
}

function BlogPage() {
  const { id } = useParams();
  // const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();

  const {
    token,
    email,
    id: userId,
    profilePic,
  } = useSelector((state) => state.user);
  const { likes, comments, content } = useSelector(
    (state) => state.currentBlog
  );
  const { isOpen } = useSelector((state) => state.comment);
  const [blogData, setBlogData] = useState(null);
  const [isLike, setisLike] = useState(false);

  async function fetchBlogbyId() {
    try {
      const {
        data: { blogs },
      } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`);
      setBlogData(blogs);
      if (blogs.likes.includes(userId)) {
        setisLike((prev) => !prev);
      }
      dispatch(addSelectedBlog(blogs));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  async function handlelike() {
    if (token) {
      setisLike((prev) => !prev);
      let res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/like/${blogData._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(changeLikes(userId));
      toast.success(res.data.message);
    } else {
      return toast.error("Please Sign in to like this blog");
    }
  }

  useEffect(() => {
    fetchBlogbyId();
    return () => {
      dispatch(setIsOpen(false));
      if (window.location.pathname !== `/edit-blog/${id}`) {
        dispatch(removeSelectedBlog());
      }
    };
  }, []);

  return (
    <div className="max-w-[750px] mx-auto p-5">
      {blogData ? (
        <div>
          <h1 className="mt-10 font-bold text-3xl sm:text-4xl lg:text-6xl  capitalize">
            {blogData.title}
          </h1>
          <div className="flex items-center my-5 gap-3">
            <div>
              <Link to={`/@${blogData.creator.username}`}>
                <div className="w-10 h-10 cursor-pointer">
                  <img
                    className="w-full h-full rounded-full object-contain"
                    src={
                      profilePic
                        ? profilePic
                        : `https://api.dicebear.com/9.x/micah/svg?seed=${blogData.creator.name}`
                    }
                    alt=""
                  />
                </div>
              </Link>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <Link to={`/@${blogData.creator.username}`}>
                  <h2 className="text-xl hover:underline cursor-pointer">
                    {blogData.creator.name}
                  </h2>
                </Link>
                {blogData.creator._id !== userId ? (
                  <p
                    onClick={() =>
                      handleFollowCreator(blogData.creator._id, token)
                    }
                    className="text-xl font-medium my-2 cursor-pointer text-green-700"
                  >
                    {!blogData?.creator?.followers?.includes(userId)
                      ? "follow"
                      : "following"}
                  </p>
                ) : (
                  ""
                )}
              </div>
              <div>
                <span>6 min read</span>
                <span className="mx-2">{formatDate(blogData.createdAt)}</span>
              </div>
            </div>
          </div>

          <img src={blogData.image} alt="" />
          <p className="my-10 text-2xl">{blogData.description}</p>
          {token && email === blogData.creator.email && (
            <Link to={`/edit-blog/${blogData.blogId}`}>
              <button className="bg-green-400 mt-5 px-6 py-2 text-xl rounded">
                Edit
              </button>
            </Link>
          )}
          <div className="flex gap-7 mt-4">
            <div className="cursor-pointer flex gap-2">
              {isLike ? (
                <i
                  onClick={handlelike}
                  className="fi text-blue-600 text-3xl mt-1 fi-sr-thumbs-up"
                ></i>
              ) : (
                <i
                  onClick={handlelike}
                  className="fi text-3xl mt-1 fi-rr-social-network"
                ></i>
              )}
              <p className="text-2xl">{likes.length}</p>
            </div>
            <div className="flex gap-2">
              <i
                onClick={() => dispatch(setIsOpen())}
                className="fi text-3xl mt-1 fi-sr-comment-alt"
              ></i>
              <p className="text-2xl">{comments.length}</p>
            </div>
            <div
              className="flex gap-2 cursor-pointer"
              onClick={(e) => {
                handleSaveBlogs(blogData._id, token);
              }}
            >
              {blogData?.totalSaves?.includes(userId) ? (
                <i className="fi text-3xl mt-1 fi-sr-bookmark"></i>
              ) : (
                <i className="fi text-3xl mt-1 fi-rr-bookmark"></i>
              )}
            </div>
          </div>
          <div className="my-10">
            {content.blocks.map((block) => {
              if (block.type == "header") {
                if (block.data.level == 1) {
                  return (
                    <h1
                      className="font-bold text-4xl my-4"
                      dangerouslySetInnerHTML={{ __html: block.data.text }}
                    ></h1>
                  );
                } else if (block.data.level == 2) {
                  return (
                    <h2
                      className="font-bold text-3xl my-4"
                      dangerouslySetInnerHTML={{ __html: block.data.text }}
                    ></h2>
                  );
                } else if (block.data.level == 3) {
                  return (
                    <h3
                      className="font-bold text-2xl my-4"
                      dangerouslySetInnerHTML={{ __html: block.data.text }}
                    ></h3>
                  );
                } else if (block.data.level == 4) {
                  return (
                    <h4
                      className="font-bold text-1xl my-4"
                      dangerouslySetInnerHTML={{ __html: block.data.text }}
                    ></h4>
                  );
                }
              } else if (block.type == "paragraph") {
                return (
                  <p dangerouslySetInnerHTML={{ __html: block.data.text }}></p>
                );
              } else if (block.type == "image") {
                return (
                  <div className="my-4">
                    <img src={block.data.file.url} alt="" />
                    <p className="text-center my-2">{block.data.caption}</p>
                  </div>
                );
              }
            })}
          </div>
        </div>
      ) : (
        <div>Loading ......</div>
      )}
      {isOpen && <Comment />}
    </div>
  );
}

export default BlogPage;
