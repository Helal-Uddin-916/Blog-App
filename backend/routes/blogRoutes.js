const express = require("express");
const {
  getAllBlog,
  getBlogbyid,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  saveBlog,
  searchBlogs,
} = require("../controllers/blogController");
const verifyUser = require("../Middleware/auth");
const {
  addComment,
  deleteComment,
  editComment,
  likeComment,
  addnestedComment,
} = require("../controllers/commentController");
const upload = require("../utils/multer");
const route = express.Router();

//Blog Routes
route.delete("/blogs/:id", verifyUser, deleteBlog);
route.patch(
  "/blogs/:id",
  verifyUser,
  upload.fields([{ name: "image", maxCount: 1 }, { name: "images" }]),
  updateBlog
);
route.post(
  "/blogs",
  verifyUser,
  upload.fields([{ name: "image", maxCount: 1 }, { name: "images" }]),
  createBlog
);
route.get("/blogs", getAllBlog);
route.get("/blogs/:blogId", getBlogbyid);

//Like Routes
route.post("/blogs/like/:id", verifyUser, likeBlog);

//Comment Routes
route.post("/blogs/comment/:id", verifyUser, addComment);
route.delete("/blogs/comment/:id", verifyUser, deleteComment);
route.patch("/blogs/edit-comment/:id", verifyUser, editComment);
route.patch("/blogs/like-comment/:id", verifyUser, likeComment);

//for nested comment
route.post("/comment/:parentCommentId/:id", verifyUser, addnestedComment);

route.patch("/save-blog/:id", verifyUser, saveBlog);

route.get("/search-blogs", searchBlogs);

module.exports = route;
