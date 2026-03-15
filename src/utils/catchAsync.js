// Wrapper function to handle async route errors in Express < 5
// without needing express-async-errors package
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
