const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // show error in console

  // status code and error message handling
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    error: {
      message: err.message,
      stack: process.env.NODE_ENV === "prod" ? "dev" : err.stack,
    },
  });
};

export default errorHandler;
