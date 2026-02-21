export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const response = {
    message: err.message || 'Unexpected server error.'
  };

  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  if (next) {
    // keep lint/style simple without extra tooling
  }

  res.status(statusCode).json(response);
};
