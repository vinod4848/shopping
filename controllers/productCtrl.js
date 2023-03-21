const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

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
    const updateProduct = await Product.findOneAndUpdate({id}, req.body, {
      new: true,
    });
    res.json(updateProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProduct = asyncHandler(async (req, res) => {
  try {
    const getAllProduct = await Product.find();
    res.json(getAllProduct);
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

module.exports = {
  createProduct,
  getAllProduct,
  getProduct,
  deletetProduct,
  updateProduct,
};
