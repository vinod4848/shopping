const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
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
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
