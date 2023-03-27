const express = require("express");
const {
  getAllblogCat,
  updateblogCat,
  deleteblogCat,
  createblogCat,
  getblogCat,
} = require("../controllers/blogCatCtrl");
const { authmiddleware, isAdmin } = require("../middleware/authmiddleware");
const router = express.Router();
router.post("/createblogCat", authmiddleware, isAdmin, createblogCat);
router.get("/getAllblogCat", authmiddleware, isAdmin, getAllblogCat);
router.get("/:id", authmiddleware, isAdmin, getblogCat);
router.put("/:id", authmiddleware, isAdmin, updateblogCat);
router.delete("/:id", authmiddleware, isAdmin, deleteblogCat);

module.exports = router;
