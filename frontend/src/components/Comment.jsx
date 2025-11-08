import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsOpen } from "../utils/commentSlice";
import axios from "axios";
import { setComments, setCommentsLike } from "../utils/selectedBlogSlice";
import { formatDate } from "../utils/formatDate";
import toast from "react-hot-toast";
import DisplayComments from "./DisplayComments";

function Comment() {
  const dispatch = useDispatch();
  const [comment, setcomment] = useState("");
  const [activeReply, setActiveReply] = useState(null);
  const [currentPopup, setCurrentPopup] = useState(null);
  const [currentEditComment, setcurrentEditComment] = useState(null);

  const {
    _id: blogId,
    comments,
    creator: { _id: creatorId },
  } = useSelector((state) => state.currentBlog);
  const { token, id: userId } = useSelector((state) => state.user);

  async function handleComment() {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/comment/${blogId}`,
        {
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      dispatch(setComments(res.data.newComment));
      setcomment("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  return (
    <div className=" bg-white h-screen fixed p-5 top-0 right-0 w-[400px] border-l drop-shadow-xl overflow-y-scroll">
      <div className="flex justify-between">
        <h1 className="text-xl font-medium">Comment({comments.length})</h1>
        <i
          onClick={() => dispatch(setIsOpen(false))}
          className="fi fi-br-cross text-lg mt-1 cursor-pointer"
        ></i>
      </div>
      <div className="my-4">
        <textarea
          type="text"
          placeholder="Comment..."
          className=" h-[150px] border resize-none drop-shadow w-full p-3 text-lg focus:outline-none"
          onChange={(e) => setcomment(e.target.value)}
        />
        <button onClick={handleComment} className="bg-green-500 px-6 py-3 my-2">
          Add
        </button>
      </div>
      <div className="mt-4">
        <DisplayComments
          comments={comments}
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
    </div>
  );
}

export default Comment;
