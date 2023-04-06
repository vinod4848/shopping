const ENQ = require("../models/enqModel");
const asyncHandler = require("express-async-handler");

const createenq = asyncHandler(async (req, res) => {
  try {
    const newenq = await ENQ.create(req.body);
    res.json(newenq);
  } catch (error) {
    throw new Error(error);
  }
});
const updateenq = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updateenq = await ENQ.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateenq);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllenq = asyncHandler(async (req, res) => {
  try {
    const getAllenq = await ENQ.find();
    res.json(getAllenq);
  } catch (error) {
    throw new Error(error);
  }
});
const getenq = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getenq = await ENQ.findById(id);
    res.json({
      getenq,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const deleteenq = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteenq = await ENQ.findByIdAndDelete(id);
    res.json({
      deleteenq,
    });
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createenq,
  updateenq,
  getAllenq,
  getenq,
  deleteenq,
};
