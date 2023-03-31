const express = require("express");
const {
    createcoupon,
    updatecoupon,
    getAllcoupon,
    getcoupon,
    deletecoupon,
} = require("../controllers/couponCtrl");
const { authmiddleware, isAdmin } = require("../middleware/authmiddleware");
const router = express.Router();

router.post("/createcoupon", authmiddleware, isAdmin, createcoupon);
router.get("/getAllcoupon", authmiddleware, isAdmin, getAllcoupon);
router.get("/:id", authmiddleware, isAdmin, getcoupon);
router.put("/:id", authmiddleware, isAdmin, updatecoupon);
router.delete("/:id", authmiddleware, isAdmin, deletecoupon);

module.exports = router;
