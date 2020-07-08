class APIError {
  constructor(code_, message_) {
    return {
      code: `${code_}`, // Force a string
      message: message_,
      isAPIError: true,
    };
  }
}
module.exports = APIError;
