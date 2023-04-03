const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");

const createcoupon = asyncHandler(async (req, res) => {
    try {
        const newcoupon = await Coupon.create(req.body);
        res.json(newcoupon);
    } catch (error) {
        throw new Error(error);
    }
});
const updatecoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const updatecoupon = await Coupon.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updatecoupon);
    } catch (error) {
        throw new Error(error);
    }
});
const getAllcoupon = asyncHandler(async (req, res) => {
    try {
        const getAllcoupon = await Coupon.find();
        res.json(getAllcoupon);
    } catch (error) {
        throw new Error(error);
    }
});
const getcoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const getcoupon = await Coupon.findById(id).populate('productId');
        res.json({
            getcoupon,
        });
    } catch (error) {
        throw new Error(error);
    }
});
const deletecoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deletecoupon = await Coupon.findByIdAndDelete(id);
        res.json({
            deletecoupon,
        });
    } catch (error) {
        throw new Error(error);
    }
});
module.exports = {
    createcoupon,
    updatecoupon,
    getAllcoupon,
    getcoupon,
    deletecoupon,
};
