const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/oderModel");
const { generateToken } = require("../helpers/jwt");
const { generateRefreshToken } = require("../helpers/refreshToken");
const {
  isValidObjectId,
  islidateMogoDId,
} = require("./utils/validationUserId");
const jwt = require("jsonwebtoken");
const { sendmail } = require("../helpers/sendmail");
const crypto = require("crypto");
const uniqid = require("uniqid");

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User already exists");
  }
});
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.ispasswordMethods(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateUser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    // console.log(updateUser);
    res.cookie(`refreshToken`, refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstName: findUser?.firstName,
      lastName: findUser?.lastName,
      email: findUser?.email,
      mobile: findUser?.mobile,
      role: findUser?.role,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});
const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) throw new Error("No Refresh Token in cookies");
  const refreshToken = cookies.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204);
});
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  // console.log(cookies);
  if (!cookies?.refreshToken) throw new Error("No Refresh Token in cookies");
  const refreshToken = cookies.refreshToken;
  // console.log(refreshToken);
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No Refresh Token in in db or not matched");
  // res.json(user)
  jwt.verify(refreshToken, process.env.SECRET, (err, decoded) => {
    // console.log(decoded);
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getAllUsers = await User.find();
    res.json(getAllUsers);
  } catch (error) {
    throw new Error(error);
  }
});
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  isValidObjectId(id);
  try {
    const getUser = await User.findById(id);
    res.json({
      getUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const deletetUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  isValidObjectId(id);
  try {
    const deletetUser = await User.findByIdAndDelete(id);
    res.json({
      deletetUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  isValidObjectId(_id);
  try {
    const updateUser = await User.findByIdAndUpdate(_id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      mobile: req.body.mobile,
      email: req.body.email,
    });
    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  isValidObjectId(id);
  try {
    const blockuser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json(blockuser);
  } catch (error) {
    throw new Error(error);
  }
});
const unblokUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  isValidObjectId(id);
  try {
    const unlock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      massage: "User is Unlocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});
const updatedPassword = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { _id } = req.user;
  const { password } = req.body;
  islidateMogoDId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});
const forgotPassword = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });
  if (!user) throw new Error("User Not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetUrl = `Hi Please follow the link to reset your Password  this link valid till 10 minutes for now.<a href='http://localhost:5000/api/user/resetPassword/${token}'>Click Here</>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      html: resetUrl,
    };
    sendmail(data).then(() => {
      res.json(token);
    });
  } catch (error) {
    throw new Error(error);
  }
});
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const harshtoken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordRestToken: harshtoken,
    resetpasswordExpire: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token expired try again later");
  user.password = password;
  user.passwordRestToken = undefined;
  user.resetpasswordExpire = undefined;
  await user.save();
  res.json(user);
});
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin") throw new Error("Not authorized");
  if (findAdmin && (await findAdmin.ispasswordMethods(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateAdmin = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie(`refreshToken`, refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstName: findAdmin?.firstName,
      lastName: findAdmin?.lastName,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      role: findAdmin?.role,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});
const loginmerchant = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "merchant") throw new Error("Not authorized");
  if (findAdmin && (await findAdmin.ispasswordMethods(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateAdmin = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie(`refreshToken`, refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstName: findAdmin?.firstName,
      lastName: findAdmin?.lastName,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      role: findAdmin?.role,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});
const getWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});
const updateAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  isValidObjectId(_id);
  try {
    const updateAddress = await User.findByIdAndUpdate(_id, {
      address: req.body.address,
    });
    res.json(updateAddress);
  } catch (error) {
    throw new Error(error);
  }
});
const addToCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  try {
    const products = [];
    const user = await User.findById(_id);
    const alreadycart = await Cart.findOne({ orderby: user._id });
    if (alreadycart) {
      alreadycart.remove();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user._id,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});
const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const cart = await Cart.findOne({ orderby: _id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});
const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndRemove({ orderby: user._id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});
const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  const validcoupon = await Coupon.findOne({ name: coupon });
  if (validcoupon === null) {
    throw new Error("Invailid Coupon");
  }
  const user = await User.findOne({ _id });
  let { cartTotal } = await Cart.findOne({
    orderby: user._id,
  }).populate("products.product");
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validcoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true }
  );
  res.json(totalAfterDiscount);
});
const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  try {
    if (!COD) throw new Error("Create Cash on Deliver failed");
    const user = await User.findById(_id);
    let usercart = await Cart.findOne({ orderby: user._id });
    let finalAmount = 0;
    if (couponApplied && usercart.totalAfterDiscount) {
      finalAmount = usercart.totalAfterDiscount;
    } else {
      finalAmount = usercart.cartTotal;
    }
    let neworder = await Order({
      products: usercart.products,
      paymentintent: {
        id: uniqid(),
        paymentMethod: "COD",
        amount: finalAmount,
        status: "Cash on Deliver",
        created: Date.now(),
        currency: "INR",
      },
      orderby: user._id,
      orderStatus: "Cash on Deliver",
    }).save();
    let update = usercart.products.map((item) => {
      return {
        updateOne: {
          filter: { id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    const updated = await Product.bulkWrite(update, {});
    res.json({ massage: "success" });
  } catch (error) {
    throw new Error(error);
  }
});
const getOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const getOrder = await Order.findOne({ orderby: _id })
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(getOrder);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllOrder = asyncHandler(async (req, res) => {
  try {
    const getAllUsersOrder = await Order.find()
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(getAllUsersOrder);
  } catch (error) {
    throw new Error(error);
  }
});
const getOrderByUserId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const userorders = await Order.findOne({ orderby: id })
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(userorders);
  } catch (error) {
    throw new Error(error);
  }
});
const updateorderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updateStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentintent: {
          status: status,
        },
      },
      { new: true }
    );
    res.json(updateStatus);
  } catch (error) {}
});
module.exports = {
  createUser,
  login,
  logout,
  getAllUser,
  getUser,
  deletetUser,
  updateUser,
  blockUser,
  unblokUser,
  handleRefreshToken,
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
  createOrder,
  getOrder,
  updateorderStatus,
  loginmerchant,
  getAllOrder,
  getOrderByUserId,
};
