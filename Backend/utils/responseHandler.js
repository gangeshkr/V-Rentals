function sendResponse(res, statusCode, success, message, data = []) {
    const response = {
      status: statusCode,
      success: success,
      message: message,
      data: data
    };
    return res.status(statusCode).json(response);
  }
  
module.exports = { sendResponse };