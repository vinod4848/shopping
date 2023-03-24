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
} = require("../controllers/userCtrl");
const { authmiddleware, isAdmin } = require("../middleware/authmiddleware");
const router = express.Router();
router.post("/register", createUser);
router.post("/login", login);
router.get("/logout", logout);
router.get("/getAllUser", getAllUser);
router.get("/refresh", handleRefreshToken);
router.get("/:id", authmiddleware, isAdmin, getUser);
router.delete("/:id", deletetUser);
router.put("/password", authmiddleware, updatedPassword);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword/:token", resetPassword);
router.put("/edit-user", authmiddleware, isAdmin, updateUser);
router.put("/block-user/:id", authmiddleware, isAdmin, blockUser);
router.put("/unblok-user/:id", authmiddleware, isAdmin, unblokUser);
module.exports = router;