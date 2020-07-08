class APIError {
  constructor(code_, message_) {
    return {
      code: `${code_}`, // Force a string
      message: message_
    };
  }
}
module.exports = APIError;
