const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId, ref: "Product"
                },
                count: Number,
                color: String,
                price: Number
            },
        ],
        cartTotal: Number,
        totalAfterDiscount: Number,
        paymentintent: {},
        orderby: {
            type: mongoose.Schema.Types.ObjectId, ref: "User"
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
