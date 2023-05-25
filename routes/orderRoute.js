const express = require("express");
const {
  createorder,
  updateorder,
  getAllorder,
  getorder,
  deleteorder,
} = require("../controllers/orderCtrl");
const { authmiddleware, isAdmin } = require("../middleware/authmiddleware");
const router = express.Router();

router.post("/createorder", createorder);
router.get("/getAllorder", authmiddleware, isAdmin, getAllorder);
router.get("/:id",authmiddleware, isAdmin, getorder);
router.put("/:id", authmiddleware, isAdmin, updateorder);
router.delete("/:id", authmiddleware, isAdmin, deleteorder);

module.exports = router;
