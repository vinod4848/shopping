const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const fs = require("fs")
const cloudinaryuplodeImg = require("../controllers/utils/cloudinary")
const {
  isValidObjectId,
  islidateMogoDId,
} = require("./utils/validationUserId");

const createBlogs = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json(newBlog);
  } catch (error) {
    throw new Error(error);
  }
});
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateBlog);
  } catch (error) {
    throw new Error(error);
  }
});
const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getBlog = await Blog.findById(id)
      .populate("likes")
      .populate("disliked");
    const updateBlog = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      {
        new: true,
      }
    );
    res.json(getBlog);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllBlog = asyncHandler(async (req, res) => {
  try {
    const getAllBlog = await Blog.find().populate("likes")
      .populate("disliked");;
    res.json(getAllBlog);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteBlog = await Blog.findByIdAndDelete(id);
    res.json({
      deleteBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  // islidateMogoDId(blogId);
  const blog = await Blog.findById(blogId);
  const loginUserId = req?.user?._id;
  const isLiked = blog?.isLiked;
  const alreadydislike = blog.disliked.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadydislike) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { disliked: loginUserId },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }
  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }
});
const dislikedBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  const blog = await Blog.findById(blogId);
  const loginUserId = req?.user?._id;
  const isDisliked = blog?.isDisliked;
  const alreadyLiked = blog.likes.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }
  if (isDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { disliked: loginUserId },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { disliked: loginUserId },
        isDisliked: true,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }
});
const uploadblogs = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const uploader = (path) => cloudinaryuplodeImg(path, "images");
    const urls = []
    const files = req.files;
    for (const file of files) {
      const { path } = file
      const newpath = await uploader(path);
      urls.push(newpath)
      fs.unlinkSync(path)
    }
    const findblog = await Blog.findByIdAndUpdate(id, {
      images: urls.map(file => {
        return file
      }),
    },
      {
        new: true
      }
    );
    res.json(findblog)
  } catch (error) {
    throw new Error(error)
  }
})
module.exports = {
  createBlogs,
  updateBlog,
  getBlog,
  getAllBlog,
  deleteBlog,
  likeBlog,
  dislikedBlog,
  uploadblogs,
};
