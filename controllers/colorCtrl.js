const Color = require("../models/colorModel");
const asyncHandler = require("express-async-handler");

const createcolor = asyncHandler(async (req, res) => {
    try {
        const newcolor = await Color.create(req.body);
        res.json(newcolor);
    } catch (error) {
        throw new Error(error);
    }
});
const updatecolor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const updatecolor = await Color.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updatecolor);
    } catch (error) {
        throw new Error(error);
    }
});
const getAllcolor = asyncHandler(async (req, res) => {
    try {
        const getAllcolor = await Color.find();
        res.json(getAllcolor);
    } catch (error) {
        throw new Error(error);
    }
});
const getcolor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const getcolor = await Color.findById(id);
        res.json({
            getcolor,
        });
    } catch (error) {
        throw new Error(error);
    }
});
const deletecolor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deletecolor = await Color.findByIdAndDelete(id);
        res.json({
            deletecolor,
        });
    } catch (error) {
        throw new Error(error);
    }
});
module.exports = {
    createcolor,
    updatecolor,
    getAllcolor,
    getcolor,
    deletecolor,
};
