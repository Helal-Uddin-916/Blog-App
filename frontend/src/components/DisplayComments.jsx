import React, { useState } from "react";
import { formatDate } from "../utils/formatDate";
import axios from "axios";
import toast from "react-hot-toast";
import {
  deleteCommentandReply,
  setComments,
  setCommentsLike,
  setReplies,
  setUpdatedComments,
} from "../utils/selectedBlogSlice";
import { useDispatch } from "react-redux";

function DisplayComments({
  comments,
  userId,
  blogId,
  token,
  activeReply,
  setActiveReply,
  currentPopup,
  setCurrentPopup,
  currentEditComment,
  setcurrentEditComment,
  creatorId,
}) {
  const [reply, setReply] = useState("null");
  const [updatecomment, setupdatecomment] = useState("");

  const dispatch = useDispatch();
  async function handleReply(parentCommentId) {
    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/comment/${parentCommentId}/${blogId}`,
        {
          reply,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReply("");
      setActiveReply(null);
      toast.success(res.data.message);

      dispatch(setReplies(res.data.newReply));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function handleCommentlike(commentId) {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/like-comment/${commentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      dispatch(setCommentsLike({ commentId, userId }));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  function handleActiveReply(id) {
    setActiveReply((prev) => (prev === id ? null : id));
  }

  async function handleCommentUpdate(id) {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/edit-comment/${id}`,
        {
          updatecomment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      dispatch(setUpdatedComments(res.data.updatedComment));
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setupdatecomment("");
      setcurrentEditComment(null);
    }
  }

  async function handleCommentDelete(id) {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/comment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      dispatch(deleteCommentandReply(id));
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setupdatecomment("");
      setcurrentEditComment(null);
    }
  }
  return (
    <>
      {comments.map((comment) => (
        <>
          <hr className=" border" />
          <div className="flex flex-col gap-3 my-4">
            {currentEditComment === comment._id ? (
              <div className="my-4">
                <textarea
                  defaultValue={comment.comment}
                  type="text"
                  placeholder="Reply..."
                  className=" h-[150px] border resize-none drop-shadow w-full p-3 text-lg focus:outline-none"
                  onChange={(e) => setupdatecomment(e.target.value)}
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setcurrentEditComment(null)}
                    className="bg-red-500 px-6 py-3 my-2 rounded-3xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleCommentUpdate(comment._id);
                      setCurrentPopup(null);
                    }}
                    className="bg-green-500 px-6 py-3 my-2 rounded-3xl"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex w-full justify-between">
                  <div className="flex gap-2">
                    <div className="w-10 h-10">
                      <img
                        className="rounded-full"
                        src={`https://api.dicebear.com/9.x/micah/svg?seed=${comment.user.name}`}
                        alt=""
                      />
                    </div>
                    <div>
                      <p className="capitalize font-medium">
                        {comment.user.name}
                      </p>
                      <p>{formatDate(comment.createdAt)}</p>
                    </div>
                  </div>

                  {comment.user._id === userId || userId === creatorId ? (
                    currentPopup == comment._id ? (
                      <div
                        className=" w-[70px] rounded-lg"
                        onClick={() =>
                          setCurrentPopup((prev) =>
                            prev == comment._id ? null : comment._id
                          )
                        }
                      >
                        <i className="fi fi-br-cross text-sm mt-2 relative left-12 cursor-pointer"></i>

                        {comment.user._id === userId ? (
                          <p
                            className="p-2 py-1 hover:bg-blue-300 cursor-pointer"
                            onClick={() => {
                              setcurrentEditComment(comment._id);
                              setCurrentPopup(null);
                            }}
                          >
                            Edit
                          </p>
                        ) : (
                          ""
                        )}
                        <p
                          className="p-2 py-1 hover:bg-blue-300 cursor-pointer"
                          onClick={() => {
                            handleCommentDelete(comment._id);
                            setCurrentPopup(null);
                          }}
                        >
                          Delete
                        </p>
                      </div>
                    ) : (
                      <i
                        className="fi fi-bs-menu-dots cursor-pointer"
                        onClick={() => {
                          setCurrentPopup(comment._id);
                        }}
                      ></i>
                    )
                  ) : (
                    ""
                  )}
                </div>

                <p className="font-medium text-lg">{comment.comment}</p>

                <div className="flex justify-between">
                  <div className="flex gap-4">
                    <div className="cursor-pointer flex gap-2">
                      {comment.likes.includes(userId) ? (
                        <i
                          onClick={() => handleCommentlike(comment._id)}
                          className="fi text-blue-600 text-xl mt-1 fi-sr-thumbs-up"
                        ></i>
                      ) : (
                        <i
                          onClick={() => handleCommentlike(comment._id)}
                          className="fi text-lg mt-1 fi-rr-social-network"
                        ></i>
                      )}
                      <p className="text-lg">{comment.likes.length}</p>
                    </div>
                    <div className="flex gap-2 cursor-pointer">
                      <i className="fi fi-sr-comment-alt text-lg mt-1"></i>
                      <p className="text-lg">{comment.replies.length}</p>
                    </div>
                  </div>
                  <p
                    onClick={() => handleActiveReply(comment._id)}
                    className="text=lg hover:underline"
                  >
                    reply
                  </p>
                </div>
              </>
            )}
            <div>
              {activeReply === comment._id && (
                <div className="my-4">
                  <textarea
                    type="text"
                    placeholder="Reply..."
                    className=" h-[150px] border resize-none drop-shadow w-full p-3 text-lg focus:outline-none"
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <button
                    onClick={() => handleReply(comment._id)}
                    className="bg-green-500 px-6 py-3 my-2"
                  >
                    Add
                  </button>
                </div>
              )}
              {comment.replies.length > 0 && (
                <div className="pl-6 border-l ">
                  <DisplayComments
                    comments={comment.replies}
                    userId={userId}
                    blogId={blogId}
                    token={token}
                    activeReply={activeReply}
                    setActiveReply={setActiveReply}
                    currentPopup={currentPopup}
                    setCurrentPopup={setCurrentPopup}
                    currentEditComment={currentEditComment}
                    setcurrentEditComment={setcurrentEditComment}
                    creatorId={creatorId}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      ))}
    </>
  );
}

export default DisplayComments;
