export default class ApiResponse {
    constructor(
      statusCode = 200,
      data = null,
      message = "Success",
      errors = null
    ) {
      this.statusCode = statusCode;
      this.data = data;
      this.message = message;
      this.errors = errors;
      this.status = statusCode < 400;
    }
  
    // Static method for success responses
    static success(data = {}, message = "Success", statusCode = 200) {
      return new ApiResponse(statusCode, data, message);
    }
  }