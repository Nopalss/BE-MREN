export const notFound = (req, res, next) => {
  const error = new Error(`Path Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let resStatusCode = res.statusCode === 200 ? 500 : res.statusCode;

  let message = err.message;

  // jika error name nya bernama validation error
  if (err.name === "ValidationError") {
    // ini untuk ngambil error message
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    // pesan error 1, pesan error 2
    resStatusCode = 400;
  }
  res.status(resStatusCode).json({
    message,
    stack: err.stack,
  });
};
