const BlogCat = require("../models/blogCatModel");
const asyncHandler = require("express-async-handler");

const createblogCat = asyncHandler(async (req, res) => {
  try {
    const newblogCat = await BlogCat.create(req.body);
    res.json(newblogCat);
  } catch (error) {
    throw new Error(error);
  }
});
const updateblogCat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updateblogCat = await BlogCat.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateblogCat);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllblogCat = asyncHandler(async (req, res) => {
  try {
    const getAllblogCat = await BlogCat.find();
    res.json(getAllblogCat);
  } catch (error) {
    throw new Error(error);
  }
});
const getblogCat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getblogCat = await BlogCat.findById(id);
    res.json({
      getblogCat,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const deleteblogCat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteblogCat = await BlogCat.findByIdAndDelete(id);
    res.json({
      deleteblogCat,
    });
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createblogCat,
  updateblogCat,
  getAllblogCat,
  deleteblogCat,
  getblogCat,
};
