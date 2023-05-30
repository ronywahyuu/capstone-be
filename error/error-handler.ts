// create error handler for all controllers

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

class ErrorHandler extends Error {
  statusCode: number;
  message: string;
  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }

  static prismaError(err: PrismaClientKnownRequestError) {
    if (err instanceof PrismaClientKnownRequestError) {
      return new ErrorHandler(500, err.message);
    }
  }

  static notFoundError() {
    return new ErrorHandler(404, "Not found");
  }

  static unauthorizedError() {
    return new ErrorHandler(401, "Unauthorized");
  }

  static forbiddenError() {
    return new ErrorHandler(403, "Forbidden");
  }

  static badRequestError(message: string) {
    return new ErrorHandler(400, message);
  }
}

export default ErrorHandler;
