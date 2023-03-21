const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const {generateToken}= require("../helpers/jwt")
const { generateRefreshToken } = require("../helpers/refreshToken");
const { isValidObjectId } = require("./utils/validationUserId");
const jwt = require("jsonwebtoken");

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
      maxAge: 72 * 60 * 60 * 1000,
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
    const updateUser = await User.findOneAndUpdate(
      _id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobile: req.body.mobile,
        email: req.body.email,
      },
      
    );
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
};
