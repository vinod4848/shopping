const express = require("express");
const {
  createCategory,
  updateCategory,
  getAllCategory,
  deleteCategory,
  getCategory,
} = require("../controllers/prodcategoryCtrl");
const { authmiddleware, isAdmin } = require("../middleware/authmiddleware");
const router = express.Router();

router.post("/category", authmiddleware, isAdmin, createCategory);
router.get("/category", authmiddleware, isAdmin, getAllCategory);
router.get("/:id", authmiddleware, isAdmin, getCategory);
router.put("/:id", authmiddleware, isAdmin, updateCategory);
router.delete("/:id", authmiddleware, isAdmin, deleteCategory);

module.exports = router;
