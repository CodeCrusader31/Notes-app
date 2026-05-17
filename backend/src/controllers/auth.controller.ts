import { HTTP_STATUS } from "../constants/httpStatus.js";
import { loginUser, registerUser } from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);

  sendSuccess({
    res,
    statusCode: HTTP_STATUS.CREATED,
    message: "User registered successfully",
    data: result,
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);

  sendSuccess({
    res,
    statusCode: HTTP_STATUS.OK,
    message: "User logged in successfully",
    data: result,
  });
});
