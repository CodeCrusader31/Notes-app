import { Router } from "express";

import { about } from "../controllers/about.controller.js";
import { docsIndex, getOpenApiDocument } from "../controllers/docs.controller.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { sendSuccess } from "../utils/apiResponse.js";
import authRoutes from "./auth.routes.js";
import noteRoutes from "./note.routes.js";

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

router.get("/about", about);
router.get("/docs", docsIndex);
router.get("/docs/openapi.json", getOpenApiDocument);
router.use("/auth", authRoutes);
router.use("/notes", noteRoutes);

export default router;
