const mongoose = require("mongoose");

var couponSchema = new mongoose.Schema(
    {
        couponName: {
            type: String,
            required: true,
            unique: true,
            uppercase: true
        },
        expiry: {
            type: String,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
