export const errorResponseHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export const invalidPathHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Invalid path! Current route does not exist!",
  });
};
