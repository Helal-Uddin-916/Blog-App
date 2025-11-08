import { createSlice, current } from "@reduxjs/toolkit";

const selectedBlogSlice = createSlice({
  name: "selectedBlogSlice",
  initialState: JSON.parse(localStorage.getItem("currentBlog")) || {},
  reducers: {
    addSelectedBlog(state, action) {
      localStorage.setItem("currentBlog", JSON.stringify(action.payload));
      return action.payload;
    },
    removeSelectedBlog(state, action) {
      localStorage.removeItem("currentBlog");
      return {};
    },
    changeLikes(state, action) {
      if (state.likes.includes(action.payload)) {
        state.likes = state.likes.filter((like) => like !== action.payload);
      } else {
        state.likes = [...state.likes, action.payload];
      }
      return state;
    },
    setComments(state, action) {
      state.comments = [...state.comments, action.payload];
    },
    setCommentsLike(state, action) {
      let { commentId, userId } = action.payload;
      // let comment = state.comments.find((comment) => comment._id == commentId);
      // if (comment.likes.includes(userId)) {
      //   comment.likes = comment.likes.filter((like) => like !== userId);
      // } else {
      //   comment.likes = [...comment.likes, userId];
      // }
      // return state;
      function toggleLikes(comments) {
        return comments.map((comment) => {
          if (comment._id == commentId) {
            if (comment.likes.includes(userId)) {
              comment.likes = comment.likes.filter((like) => like !== userId);
              return comment;
            } else {
              comment.likes = [...comment.likes, userId];
              return comment;
            }
          }
          if (comment.replies && comment.replies.length > 0) {
            return { ...comment, replies: toggleLikes(comment.replies) };
          }
          return comment;
        });
      }
      state.comments = toggleLikes(state.comments);
    },
    setReplies(state, action) {
      let newReply = action.payload;

      function findParentComment(comments) {
        let parentComment;
        for (const comment of comments) {
          if (comment._id === newReply.parentComment) {
            parentComment = {
              ...comment,
              replies: [...comment.replies, newReply],
            };
            break;
          }
          if (comment.replies.length > 0) {
            parentComment = findParentComment(comment.replies);
            if (parentComment) {
              parentComment = {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply._id == parentComment._id ? parentComment : reply
                ),
              };
              break;
            }
          }
        }

        return parentComment;
      }

      let parentComment = findParentComment(state.comments);
      state.comments = state.comments.map((comment) =>
        comment._id == parentComment._id ? parentComment : comment
      );
    },
    setUpdatedComments(state, action) {
      function updateComments(comments) {
        return comments.map((comment) =>
          comment._id == action.payload._id
            ? { ...comment, comment: action.payload.comment }
            : comment.replies && comment.replies.length > 0
            ? { ...comment, replies: updateComments(comment.replies) }
            : comment
        );
      }
      state.comments = updateComments(state.comments);
    },
    deleteCommentandReply(state, action) {
      function deleteComment(comments) {
        return comments
          .filter((comment) => comment._id !== action.payload)
          .map((comment) =>
            comment.replies && comment.replies.length > 0
              ? { ...comment, replies: deleteComment(comment.replies) }
              : comment
          );
      }
      state.comments = deleteComment(state.comments);
    },
  },
});

export const {
  addSelectedBlog,
  removeSelectedBlog,
  changeLikes,
  setComments,
  setCommentsLike,
  setReplies,
  setUpdatedComments,
  deleteCommentandReply,
} = selectedBlogSlice.actions;
export default selectedBlogSlice.reducer;
