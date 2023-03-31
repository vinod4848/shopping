const express = require("express");
const {
  createBlogs,
  updateBlog,
  getBlog,
  getAllBlog,
  deleteBlog,
  likeBlog,
  dislikedBlog,
  uploadblogs,
} = require("../controllers/blogCtrl");
const { authmiddleware, isAdmin } = require("../middleware/authmiddleware");
const { blogimgResize, uploadphoto } = require("../middleware/uploadimg");
const router = express.Router();

router.post("/createBlog", authmiddleware, isAdmin, createBlogs);
router.put("/likes", authmiddleware, likeBlog);
router.put("/disliked", authmiddleware, dislikedBlog);
router.get("/", authmiddleware, isAdmin, getAllBlog);
router.put("/:id", authmiddleware, isAdmin, updateBlog);
router.put("/upload/:id", authmiddleware, isAdmin, uploadphoto.array('images',2), blogimgResize, uploadblogs);
router.get("/:id", authmiddleware, isAdmin, getBlog);
router.delete("/:id", authmiddleware, isAdmin, deleteBlog);

module.exports = router;
