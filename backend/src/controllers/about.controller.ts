import { HTTP_STATUS } from "../constants/httpStatus.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const about = asyncHandler(async (_req, res) => {
  sendSuccess({
    res,
    statusCode: HTTP_STATUS.OK,
    message: "Notes App API",
    data: {
      name: "Production Notes App Backend",
      version: "1.0.0",
      features: [
        "JWT authentication",
        "Private and shared notes",
        "Favorites and pinned notes",
        "Version history",
        "Pagination and full-text search",
        "Soft delete and restore",
        "Tags",
      ],
    },
  });
});
