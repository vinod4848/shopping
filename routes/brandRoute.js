const express = require("express");
const {
  createbrand,
  updatebrand,
  getAllbrand,
  getbrand,
  deletebrand,
} = require("../controllers/brandCtrl");
const { authmiddleware, isAdmin } = require("../middleware/authmiddleware");
const router = express.Router();

router.post("/createbrand", authmiddleware, isAdmin, createbrand);
router.get("/getAllbrand", authmiddleware, isAdmin, getAllbrand);
router.get("/:id", authmiddleware, isAdmin, getbrand);
router.put("/:id", authmiddleware, isAdmin, updatebrand);
router.delete("/:id", authmiddleware, isAdmin, deletebrand);

module.exports = router;
