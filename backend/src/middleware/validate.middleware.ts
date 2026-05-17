import { validationResult } from "express-validator";
import type { RequestHandler } from "express";

import { HTTP_STATUS } from "../constants/httpStatus.js";
import { AppError } from "../errors/AppError.js";

export const validateRequest: RequestHandler = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(new AppError("Validation failed", HTTP_STATUS.UNPROCESSABLE_ENTITY, errors.array()));
    return;
  }

  next();
};
