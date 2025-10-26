const ErrorResponse = require("../utils/errorresponse");
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.log(err.stack.red);
  console.log(err.name);

  if (err.name === "CastError") {
    const message = `Bootcamp not found with the id of ${
      !err.value._id ? err.value : err.value._id
    }`;
    error = new ErrorResponse(message, 404);
  }
  //   Duplicate key
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }
  //   validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "server error" });
};

module.exports = errorHandler;
