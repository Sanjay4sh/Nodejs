
export const ApiResponse = (res, success, message, code = 200, data = []) => {

  res.status(code).send({
    message: message,
    data: data,
    success: success,
  });

};
