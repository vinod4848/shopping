function errorHandler(err, req, res, next) {
  switch (true) {
    case typeof err === "string":
      // custom application error
      const is404 = err.toLowerCase().endsWith("not found");
      const statusCode = is404 ? 404 : 400;
      return res.status(statusCode).json({ message: err });
    case err.name === "ValidationError":
      // mongoose validation error
      return res.status(400).json({ message: err.message });
    case err.name === "UnauthorizedError":
      // jwt authentication error
      return res.status(401).json({ message: "Unauthorized" });
    default:
      return res.status(500).json({ message: err.message });
  }
}

module.exports = { errorHandler };

// const notfound =(req,res,next) => {
//     const error = new Error(`not found :${req.originalurl}`);
//     res.status(404);
//     next(error);
// };

// const errorHandler =(err,req, res, next) => {
// const statusCode = res.statusCode == 200 ? 500 :res.statusCode;
// res.status(statusCode);
// res.json({
//     message:err?.message,
//     stack:err?.stack,
//    });
// };
