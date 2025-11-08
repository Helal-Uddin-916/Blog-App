const express = require("express");
const User = require("../models/userSchema");
const {
  deleteUser,
  updateUser,
  createUsers,
  getAllUsers,
  getUserbyId,
  login,
  googleAuth,
  verifyEmail,
  followUser,
  changeSAVEDLIKEDBlog,
} = require("../controllers/userController");
const verifyUser = require("../Middleware/auth");
const upload = require("../utils/multer");
const route = express.Router();

route.delete("/users/:id", verifyUser, deleteUser);

route.patch("/users/:id", verifyUser, upload.single("profilePic"), updateUser);

route.post("/signup", createUsers);

route.post("/signin", login);

route.get("/users", getAllUsers);

route.get("/users/:username", getUserbyId);

route.get("/verify-email/:verificationToken", verifyEmail);

route.post("/google-auth", googleAuth);

route.patch("/follow/:id", verifyUser, followUser);

route.patch(
  "/change-saved-liked-blog-visility",
  verifyUser,
  changeSAVEDLIKEDBlog
);

module.exports = route;
