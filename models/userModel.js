const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
    },
    cart: {
      type: Array,
      default: [],
    },
    address: {
      type: String
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    refreshToken: {
      type: String,
    },
    PasswordChangedAt: Date,
    passwordRestToken: String,
    resetpasswordExpire: String,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.ispasswordMethods = async function (enterpassword) {
  return await bcrypt.compare(enterpassword, this.password);
};

userSchema.methods.createPasswordResetToken = async function () {
  const resettoken = crypto.randomBytes(20).toString("hex");
  this.passwordRestToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");
  this.resetpasswordExpire = Date.now() + 30 * 60 * 1000; // Valid for 10 minutes
  return resettoken;
};

module.exports = mongoose.model("User", userSchema);
