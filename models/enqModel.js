const mongoose = require("mongoose");

var enqSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Submited",
      enum: ["Submited", "Contacted", "In progress"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ENQ", enqSchema);
