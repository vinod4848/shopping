const express = require("express");
const { uploadimgs, deleteimgs } = require("../controllers/uploadCtrl");
const { authmiddleware, isAdmin } = require("../middleware/authmiddleware");
const { uploadphoto, productimgResize } = require("../middleware/uploadimg");
const router = express.Router();
router.post("/", authmiddleware, isAdmin, uploadphoto.array("images", 10), productimgResize, uploadimgs);
router.delete("/delete-img/:id", authmiddleware, isAdmin, deleteimgs);

module.exports = router;
