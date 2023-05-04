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
  const id = req.params.id;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
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
    let query = Product.find(JSON.parse(queryStar)).populate("createdBy");
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
    // console.log(page, limit, skip);

    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getProduct = await Product.findById(id).populate("createdBy");
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
      let user = await User.findByIdAndUpdate(
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
      let user = await User.findByIdAndUpdate(
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
const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const product = await Product.findById(prodId);
    let alredyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if (alredyRated) {
      const updateReting = await Product.updateOne(
        {
          ratings: { $elemMatch: alredyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      const reteProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }
    const getAllretings = await Product.findById(prodId);
    let totalRating = getAllretings.ratings.length;
    let countRating = getAllretings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(countRating / totalRating);
    let finelProduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalRating: actualRating,
      },
      { new: true }
    );
    res.json(finelProduct);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createProduct,
  getAllProduct,
  getProduct,
  deletetProduct,
  updateProduct,
  addWishlist,
  rating,
};
