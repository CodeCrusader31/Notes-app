import type { ErrorRequestHandler } from "express";
import mongoose from "mongoose";

import { HTTP_STATUS } from "../constants/httpStatus.js";
import { AppError } from "../errors/AppError.js";
import { env } from "../config/env.js";

interface ErrorResponse {
  success: false;
  message: string;
  details?: unknown;
  stack?: string;
}

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = "Internal server error";
  let details: unknown;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    details = error.details;
  } else if (error instanceof mongoose.Error.ValidationError) {
    statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY;
    message = "Validation failed";
    details = Object.values(error.errors).map((err) => err.message);
  } else if (error instanceof mongoose.Error.CastError) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = "Invalid resource identifier";
  } else if (error instanceof Error) {
    message = error.message;
  }

  const response: ErrorResponse = {
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(env.nodeEnv === "development" && error instanceof Error ? { stack: error.stack } : {}),
  };

  res.status(statusCode).json(response);
};
