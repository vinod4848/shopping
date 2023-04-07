const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId, ref: "Product"
                },
                count: Number,
                color: String
            },
        ],
        paymentintent: {},
        orderStatus: {
            type: String,
            enum : ["Not Processed", "Cash on Deliver", " Processing", "Cancelled", "Dispatched", "Delivered"],
            default: "Not Processed",
        },

        orderby: {
            type: mongoose.Schema.Types.ObjectId, ref: "User"
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
