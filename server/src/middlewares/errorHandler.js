import ApiError from "../utils/ApiError.js";

export default function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message,
      ...err,
    });
  }

  console.error(err);
  // Handle other unexpected errors
  res.status(500).json({ message: "Internal server error" });
}
