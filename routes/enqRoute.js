const express = require("express");
const {
  createenq,
  updateenq,
  getAllenq,
  getenq,
  deleteenq,
} = require("../controllers/enqCtrl");
const { authmiddleware, isAdmin } = require("../middleware/authmiddleware");
const router = express.Router();

router.post("/createenq", authmiddleware, createenq);
router.get("/getAllenq", authmiddleware, isAdmin, getAllenq);
router.get("/:id", authmiddleware, isAdmin, getenq);
router.put("/:id", authmiddleware, updateenq);
router.delete("/:id", authmiddleware, isAdmin, deleteenq);

module.exports = router;
