const { protect } = require("./authMiddleware");
const {
  authorize,
  isStudent,
  isEmployer,
  isAdmin,
} = require("./roleMiddleware");
const { notFound, errorHandler } = require("./errorMiddleware");

module.exports = {
  protect,
  authorize,
  isStudent,
  isEmployer,
  isAdmin,
  notFound,
  errorHandler,
};
