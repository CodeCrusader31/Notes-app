import type { RequestHandler } from "express";
import { Types } from "mongoose";

import { HTTP_STATUS } from "../constants/httpStatus.js";
import { AppError } from "../errors/AppError.js";
import { User } from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authenticate = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Authentication token is required", HTTP_STATUS.UNAUTHORIZED);
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyAccessToken(token);

  if (!Types.ObjectId.isValid(payload.sub)) {
    throw new AppError("Invalid authentication token", HTTP_STATUS.UNAUTHORIZED);
  }

  const user = await User.findById(payload.sub).select("_id email").lean();

  if (!user) {
    throw new AppError("Authenticated user no longer exists", HTTP_STATUS.UNAUTHORIZED);
  }

  req.user = {
    id: user._id.toString(),
    email: user.email,
    _id: user._id,
  };

  next();
}) as RequestHandler;
