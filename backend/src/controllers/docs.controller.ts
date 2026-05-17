import { openApiDocument } from "../docs/openapi.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getOpenApiDocument = asyncHandler(async (_req, res) => {
  res.status(HTTP_STATUS.OK).json(openApiDocument);
});

export const docsIndex = asyncHandler(async (_req, res) => {
  sendSuccess({
    res,
    statusCode: HTTP_STATUS.OK,
    message: "OpenAPI documentation available",
    data: {
      openapi: "/api/v1/docs/openapi.json",
    },
  });
});
