const express = require("express");
const {
  createUser,
  login,
  getAllUser,
  getUser,
  deletetUser,
  updateUser,
  blockUser,
  unblokUser,
  handleRefreshToken,
  logout,
  updatedPassword,
  forgotPassword,
  resetPassword,
  loginAdmin,
  getWishlist,
  updateAddress,
  addToCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  creatOrder,
  getOrder,
  updateorderStatus,
  loginmerchant,
  getAllOrder,
} = require("../controllers/userCtrl");
const { authmiddleware, isAdmin } = require("../middleware/authmiddleware");
const router = express.Router();
router.post("/register", createUser);
router.delete("/empty-cart", authmiddleware, emptyCart);
router.get("/Getcart", authmiddleware, getUserCart);
router.get("/getOrder", authmiddleware, getOrder);
router.get("/getAllOrder", authmiddleware, isAdmin, getAllOrder);
router.post("/user-login", login);
router.post("/admin-login", loginAdmin);
router.post("/merchant-Login", loginmerchant);
router.post("/cart/applyCoupon", authmiddleware, applyCoupon);
router.post("/cart/cash-Order", authmiddleware, creatOrder);
router.get("/logout", logout);
router.get("/getAllUser", getAllUser);
router.get("/refresh", handleRefreshToken);
router.get("/:id", authmiddleware, isAdmin, getUser);
router.delete("/:id", deletetUser);
router.get("/getWishlist", authmiddleware, getWishlist);
router.post("/cart", authmiddleware, addToCart);
router.put("/password", authmiddleware, updatedPassword);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword/:token", resetPassword);
router.put("/edit-user", authmiddleware, isAdmin, updateUser);
router.put("/update-Order/:id", authmiddleware, isAdmin, updateorderStatus);
router.put("/block-user/:id", authmiddleware, isAdmin, blockUser);
router.put("/unblok-user/:id", authmiddleware, isAdmin, unblokUser);
router.put("/update-Address", authmiddleware, updateAddress);
module.exports = router;
