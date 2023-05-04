const Order = require("../models/oderModel");
const asyncHandler = require("express-async-handler");

const createorder = asyncHandler(async (req, res) => {
    try {
        const neworder = await Order.create(req.body);
        res.json(neworder);
    } catch (error) {
        throw new Error(error);
    }
});
const updateorder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const updateorder = await Order.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updateorder);
    } catch (error) {
        throw new Error(error);
    }
});
const getAllorder = asyncHandler(async (req, res) => {
    try {
        const getAllorder = await Order.find()
        res.json(getAllorder);
    } catch (error) {
        throw new Error(error);
    }
});
const getorder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const getorder = await Order.findById(id);
        res.json({
            getorder,
        });
    } catch (error) {
        throw new Error(error);
    }
});
const deleteorder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deleteorder = await Order.findByIdAndDelete(id);
        res.json({
            deleteorder,
        });
    } catch (error) {
        throw new Error(error);
    }
});
module.exports = {
    createorder,
    updateorder,
    getAllorder,
    getorder,
    deleteorder,
};
