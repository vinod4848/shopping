const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authmiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.SECRET);

        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not Authorized token expired login again");
    }
  } else {
    throw new Error("There is no token attached to the headers");
  }
});
const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminuser = await User.findOne({ email });
  if (adminuser.role !== "admin") {
    throw new Error("You are not Admin");
  } else {
    next();
  }
});
const ismerchant = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminuser = await User.findOne({ email });
  if (adminuser.role !== "merchant") {
    throw new Error("You are not merchant");
  } else {
    next();
  }
});
module.exports = { authmiddleware, isAdmin, ismerchant };
