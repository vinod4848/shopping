const express = require("express");
const {
  createProduct,
  getAllProduct,
  getProduct,
  deletetProduct,
  updateProduct,
  addWishlist,
  rating,
} = require("../controllers/productCtrl");
const { authmiddleware, isAdmin } = require("../middleware/authmiddleware");
const router = express.Router();
router.post("/addProduct", authmiddleware, isAdmin, createProduct);
router.get("/getAllProduct", getAllProduct);
router.get("/:id", getProduct);
router.put("/wishlist", authmiddleware, addWishlist);
router.put("/rating", authmiddleware, rating);
router.put("/:id", authmiddleware, isAdmin, updateProduct);
router.delete("/:id", authmiddleware, isAdmin, deletetProduct);
module.exports = router;
