const { verify } = require("jsonwebtoken");
const Blog = require("../models/blogSchema");
const User = require("../models/userSchema");
const Comment = require("../models/commentSchema");
const { verifyJWT, decodeJWT } = require("../utils/generateToken");
const { uploadImage, deleteImage } = require("../utils/uploadImage");
const uniqid = require("uniqid");
const ShortUniqueId = require("short-unique-id");
const { randomUUID } = new ShortUniqueId({ length: 10 });
const fs = require("fs");
const { message } = require("statuses");
const { options } = require("../utils/transporter");

async function createBlog(req, res) {
  try {
    const creator = req.user;
    const { title, description } = req.body;
    const draft = req.body.draft == "false" ? false : true;
    const { image, images } = req.files;
    const content = JSON.parse(req.body.content);
    const tags = JSON.parse(req.body.tags);
    if (!title) {
      return res.status(200).json({ message: "Please fill title fields" });
    }
    if (!description) {
      return res
        .status(200)
        .json({ message: "Please fill description fields" });
    }
    if (!content) {
      return res.status(200).json({ message: "Please fill content fields" });
    }
    const findUser = await User.findById(creator);
    if (!findUser) {
      return res.status(500).json({
        message: "Please Insert correct User ID",
      });
    }

    let imageIndex = 0;
    for (let i = 0; i < content.blocks.length; i++) {
      const block = content.blocks[imageIndex];
      if (block.type === "image") {
        const { secure_url, public_id } = await uploadImage(
          `data:image/jpeg;base64,${images[imageIndex].buffer.toString(
            "base64",
          )}`,
        );
        block.data.file = {
          url: secure_url,
          imageId: public_id,
        };
        imageIndex++;
      }
    }

    const { secure_url, public_id } = await uploadImage(
      `data:image/jpeg;base64,${image[0].buffer.toString("base64")}`,
    );

    // const blogId = title.toLowerCase().replace(/ +/g, "-")
    const blogId =
      title.toLowerCase().split(" ").join("-") + "-" + randomUUID();

    const blog = await Blog.create({
      title,
      description,
      draft,
      creator,
      image: secure_url,
      imageId: public_id,
      blogId,
      content,
      tags,
    });

    await User.findByIdAndUpdate(creator, { $push: { blogs: blog._id } });

    if (draft) {
      return res.status(200).json({ message: "Blog Saved as Draft", blog });
    }

    return res.status(200).json({ message: "Blog Created Successfully", blog });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getBlogbyid(req, res) {
  try {
    const { blogId } = req.params;
    const blogs = await Blog.findOne({ blogId })
      .populate({
        path: "creator",
        select: "name email followers username profilePic",
      })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .lean();

    async function populateReplies(comments) {
      for (const comment of comments) {
        let populatedComment = await Comment.findById(comment._id)
          .populate({
            path: "replies",
            populate: {
              path: "user",
              select: "name email",
            },
          })
          .lean();

        comment.replies = populatedComment.replies;

        if (comment.replies.length > 0) {
          await populateReplies(comment.replies);
        }
      }
      return comments;
    }

    blogs.comments = await populateReplies(blogs.comments);

    if (!blogs) {
      return res.status(404).json({
        message: "Blog Not Found",
      });
    }

    return res.status(200).json({
      message: "Blog Fetched Successfully",
      blogs,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getAllBlog(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ draft: false })
      .populate({
        path: "creator",
        select: "name email",
      })
      .populate({
        path: "comments",
        select: "comment",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBlogs = await Blog.countDocuments({ draft: false });

    return res.status(200).json({
      message: "Blogs fetched Successfully",
      blogs,
      hasMore: skip + blogs.length < totalBlogs, // ✅ FIXED
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function updateBlog(req, res) {
  try {
    const creator = req.user;
    const { id } = req.params;
    const { title, description } = req.body;
    const draft = req.body.draft == "false" ? false : true;
    const content = JSON.parse(req.body.content);
    const tags = JSON.parse(req.body.tags);
    const existingImages = JSON.parse(req.body.existingImages);

    const blog = await Blog.findOne({ blogId: id });
    if (!(creator == blog.creator)) {
      return res.status(500).json({
        message: "You are not authorized",
      });
    }

    let imagedToDelete = blog.content.blocks
      .filter((block) => block.type == "image")
      .filter(
        (block) =>
          !existingImages.find(({ url }) => url == block.data.file.url),
      )
      .map((block) => block.data.file.imageId);

    if (imagedToDelete.length > 0) {
      await Promise.all(imagedToDelete.map((id) => deleteImage(id)));
    }

    if (req.files.images) {
      let imageIndex = 0;
      for (let i = 0; i < content.blocks.length; i++) {
        const block = content.blocks[i];
        if (block.type === "image" && block.data.file.image) {
          const { secure_url, public_id } = await uploadImage(
            `data:image/jpeg;base64,${req.files.images[
              imageIndex
            ].buffer.toString("base64")}`,
          );
          block.data.file = {
            url: secure_url,
            imageId: public_id,
          };
          imageIndex++;
        }
      }
    }

    if (req.files.image) {
      await deleteImage(blog.imageId);
      const { secure_url, public_id } = await uploadImage(
        `data:image/jpeg;base64,${req.files.image[0].buffer.toString("base64")}`,
      );
      blog.image = secure_url;
      blog.imageId = public_id;
    }

    const updatedblogs = await Blog.findOneAndUpdate(
      { blogId: id },
      { title, description, draft, content, tags },
      { new: true },
    );

    await blog.save();

    if (draft) {
      return res
        .status(200)
        .json({ message: "Blog Saved as Draft", blog: updatedblogs });
    }

    return res.status(200).json({
      success: true,
      message: "Blogs Updated Successfully",
      blog: updatedblogs,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function deleteBlog(req, res) {
  try {
    const creator = req.user;
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(200).json({
        Sucess: true,
        message: "Blog is not found",
      });
    }
    if (!(creator == blog.creator)) {
      return res.status(500).json({
        message: "You are not authorized",
      });
    }
    await deleteImage(blog.imageId);
    await Blog.findByIdAndDelete(id);
    await User.findByIdAndUpdate(creator, { $pull: { blogs: id } });
    return res.status(200).json({
      Sucess: true,
      message: "Users deleted successfully",
      // users.splice(Number(id) - 1, 1);
    });
  } catch (error) {
    return res.staus(500).json({
      message: error.message,
    });
  }
}

async function likeBlog(req, res) {
  try {
    const user = req.user;
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(200).json({
        Sucess: true,
        message: "Blog is not found",
      });
    }
    if (!blog.likes.includes(user)) {
      await Blog.findByIdAndUpdate(id, { $push: { likes: user } });
      await User.findByIdAndUpdate(user, { $push: { likeBlogs: id } });
      return res.status(200).json({
        Sucess: true,
        message: "Blog Liked successfully",
        isLiked: true,
      });
    } else {
      await Blog.findByIdAndUpdate(id, { $pull: { likes: user } });
      await User.findByIdAndUpdate(user, { $pull: { likeBlogs: id } });
      return res.status(200).json({
        Sucess: true,
        message: "Blog Dislike successfully",
        isLiked: false,
      });
    }
  } catch (error) {
    return res.staus(500).json({
      message: error.message,
    });
  }
}

async function saveBlog(req, res) {
  try {
    const user = req.user;
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(200).json({
        Sucess: true,
        message: "Blog is not found",
      });
    }
    if (!blog.totalSaves.includes(user)) {
      await Blog.findByIdAndUpdate(id, { $set: { totalSaves: user } });
      await User.findByIdAndUpdate(user, { $set: { saveBlogs: id } });
      return res.status(200).json({
        Sucess: true,
        message: "Blog Saved successfully",
        isLiked: true,
      });
    } else {
      await Blog.findByIdAndUpdate(id, { $unset: { totalSaves: user } });
      await User.findByIdAndUpdate(user, { $unset: { saveBlogs: id } });
      return res.status(200).json({
        Sucess: true,
        message: "Blog Unsaved successfully",
        isLiked: false,
      });
    }
  } catch (error) {
    return res.staus(500).json({
      message: error.message,
    });
  }
}

async function searchBlogs(req, res) {
  try {
    const { search, tag } = req.query;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skip = (page - 1) * limit;
    let query;

    if (tag) {
      query = { tags: tag };
    } else {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }
    const blogs = await Blog.find(query, { draft: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    if (blogs.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Make sure all words are spelled correctly. Try different keywords. Try more general keywords",
        hashMore: false,
      });
    }

    const totalBlogs = await Blog.countDocuments(query, { draft: false });

    return res.status(200).json({
      message: "Blogs fetched Successfully",
      blogs,
      hasMore: skip + blogs.length < totalBlogs,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  createBlog,
  getBlogbyid,
  getAllBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  saveBlog,
  searchBlogs,
};
