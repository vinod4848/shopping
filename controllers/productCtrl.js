const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const User = require("../models/userModel");

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json({
      newProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const updateProduct = asyncHandler(async (req, res) => {
  const id = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findOneAndUpdate({ id }, req.body, {
      new: true,
    });
    res.json(updateProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProduct = asyncHandler(async (req, res) => {
  try {
    //Filterings
    const queryObj = { ...req.query };
    const excludeFieldes = ["sort", "limit", "fields", "page"];
    excludeFieldes.forEach((el) => delete queryObj[el]);
    let queryStar = JSON.stringify(queryObj);
    queryStar = queryStar.replace(
      /\b(gt|gte|lt|lte|in|elemMatch|eq)\b/g,
      (match) => `$${match}`
    );

    //Sortings
    let query = Product.find(JSON.parse(queryStar));
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //Limitations
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //Pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This page doesn't exist");
    }
    console.log(page, limit, skip);

    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getProduct = await Product.findById(id);
    res.json({
      getProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deletetProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletetProduct = await Product.findByIdAndDelete(id);
    res.json({
      deletetProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const addWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  try {
    const user = await User.findById(_id);
    const alredyadded = user.wishlist.find((id) => id.toString() === prodId);
    if (alredyadded) {
      let user = await User.findOneAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    } else {
      let user = await User.findOneAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});
const totalRating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  // const {star ,prodId}
});
module.exports = {
  createProduct,
  getAllProduct,
  getProduct,
  deletetProduct,
  updateProduct,
  addWishlist,
  totalRating,
};
