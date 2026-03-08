function notFound(req, res, next) {
  res.status(404).json({ message: "Route not found" });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = Number(err.statusCode || err.status || 500);
  const message =
    status >= 500 ? "Internal server error" : err.message || "Request failed";

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({ message });
}

module.exports = { notFound, errorHandler };

