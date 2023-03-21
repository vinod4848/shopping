const express = require("express");
const {
  createProduct,
  getAllProduct,
  getProduct,
  deletetProduct,
  updateProduct,
} = require("../controllers/productCtrl");
const router = express.Router();
router.post("/addProduct", createProduct);
router.get("/getAllProduct", getAllProduct);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deletetProduct);
module.exports = router;
