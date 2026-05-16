import { Router } from "express";

import { HTTP_STATUS } from "../constants/httpStatus.js";
import { sendSuccess } from "../utils/apiResponse.js";

const router = Router();

router.get("/health", (_req, res) => {
  sendSuccess({
    res,
    statusCode: HTTP_STATUS.OK,
    message: "API is healthy",
    data: {
      service: "notes-api",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;

