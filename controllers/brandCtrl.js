const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");

const createbrand = asyncHandler(async (req, res) => {
  try {
    const newbrand = await Brand.create(req.body);
    res.json(newbrand);
  } catch (error) {
    throw new Error(error);
  }
});
const updatebrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updatebrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatebrand);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllbrand = asyncHandler(async (req, res) => {
  try {
    const getAllbrand = await Brand.find();
    res.json(getAllbrand);
  } catch (error) {
    throw new Error(error);
  }
});
const getbrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getbrand = await Brand.findById(id);
    res.json({
      getbrand,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const deletebrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletebrand = await Brand.findByIdAndDelete(id);
    res.json({
      deletebrand,
    });
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createbrand,
  updatebrand,
  getAllbrand,
  getbrand,
  deletebrand,
};
