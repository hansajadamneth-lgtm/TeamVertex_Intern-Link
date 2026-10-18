/**
 * 404 Not Found Middleware
 * Triggered when a requested endpoint does not match any registered routes.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Resource not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global Centralized Error Handling Middleware
 * Intercepts Mongoose CastErrors, duplicate keys, validation failures,
 * JWT issues, and standard runtime errors.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = null;

  // 1. Mongoose Bad ObjectId (CastError)
  if (err.name === "CastError") {
    statusCode = 404;
    message = `Resource not found with identifier: ${err.value}`;
  }

  // 2. Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `An entry with this ${field} already exists. Please choose a different value.`;
  }

  // 3. Mongoose Schema Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    const validationMessages = Object.values(err.errors || {}).map(
      (val) => val.message
    );
    message = validationMessages.join(". ");
    errors = validationMessages;
  }

  // 4. JWT Verification Errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token. Please log in again.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your authentication session has expired. Please log in again.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = {
  notFound,
  errorHandler,
};
