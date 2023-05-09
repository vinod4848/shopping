const express = require("express");
const dbConnect = require("./helpers/dbConnect");
const app = express();
const bodyparser = require("body-parser");
const dotenv = require("dotenv").config();
const blogRouter = require("./routes/blogRoute");
const authRouter = require("./routes/authRoute");
const prodcategoryRouter = require("./routes/prodcategoryRoute");
const blogCatRouter = require("./routes/blogCatRoute");
const productRouter = require("./routes/productRoute");
const brandRouter = require("./routes/brandRoute");
const colorRouter = require("./routes/colorRoute");
const couponRouter = require("./routes/couponRoute");
const orderRouter = require("./routes/orderRoute");
const enqRouter = require("./routes/enqRoute");
const uploadRouter = require("./routes/uploadRoute")
const { errorHandler } = require("./middleware/errorhandler");
const cookieParser = require("cookie-parser");
const cors = require('cors')
const morgan = require("morgan");
const PORT = process.env.PORT || 3000;
dbConnect();
app.use(cors())
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", prodcategoryRouter);
app.use("/api/blogCat", blogCatRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/order", orderRouter);
app.use("/api/color", colorRouter);
app.use("/api/enq", enqRouter);
app.use("/api/upload", uploadRouter);

app.use(errorHandler);
app.listen(PORT, () => {
  console.log("Server listening on PORT " + PORT);
});
