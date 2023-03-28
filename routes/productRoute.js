const express = require("express");
const {
  createProduct,
  getAllProduct,
  getProduct,
  deletetProduct,
  updateProduct,
  addWishlist,
} = require("../controllers/productCtrl");
const { authmiddleware, isAdmin } = require("../middleware/authmiddleware");
const router = express.Router();

router.post("/addProduct", authmiddleware, isAdmin, createProduct);
router.get("/getAllProduct", getAllProduct);
router.get("/:id", getProduct);
router.put("/wishlist", authmiddleware, isAdmin, addWishlist);
router.put("/:id", authmiddleware, isAdmin, updateProduct);
router.delete("/:id", authmiddleware, isAdmin, deletetProduct);
module.exports = router;
