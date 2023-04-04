const express = require("express");
const {
  createcolor,
  updatecolor,
  getAllcolor,
  getcolor,
  deletecolor,
} = require("../controllers/colorCtrl");
const { authmiddleware, isAdmin } = require("../middleware/authmiddleware");
const router = express.Router();

router.post("/createcolor", authmiddleware, isAdmin, createcolor);
router.get("/getAllcolor", authmiddleware, isAdmin, getAllcolor);
router.get("/:id", authmiddleware, isAdmin, getcolor);
router.put("/:id", authmiddleware, isAdmin, updatecolor);
router.delete("/:id", authmiddleware, isAdmin, deletecolor);

module.exports = router;
