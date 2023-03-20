const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const bodyparser = require("body-parser");
const dotenv = require("dotenv").config();
const authRouter = require("./routes/authRoute");
const { errorHandler } = require("./middleware/errorhandler");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 4000;
dbConnect();

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieParser());

app.use("/api/user", authRouter);
// app.use(notfound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server listening on PORT " + PORT);
});
