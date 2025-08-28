export default class ApiError extends Error {
  constructor(
    statusCode = 500,
    message = "Someting went wrong",
    error = [],
    type = "api_error",
    stack
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode < 400;
    this.error = error;
    this.type = type;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Static methods for specific error types
  static validationError(message = "Validation Error", errors = []) {
    return new ApiError(400, message, errors, "validation_error");
  }

  static authError(message = "Authentication Error") {
    return new ApiError(401, message, [], "authentication_error");
  }

  static notFoundError(resource = "Resource") {
    return new ApiError(404, `${resource} not found`, [], "not_found_error");
  }
}
