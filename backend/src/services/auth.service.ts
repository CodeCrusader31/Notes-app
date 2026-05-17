import { HTTP_STATUS } from "../constants/httpStatus.js";
import { AppError } from "../errors/AppError.js";
import { User } from "../models/User.model.js";
import { signAccessToken } from "../utils/jwt.js";

interface AuthInput {
  email: string;
  password: string;
}

interface AuthResult {
  user: {
    id: string;
    email: string;
  };
  token: string;
}

const toAuthResult = (user: { _id: unknown; email: string }): AuthResult => ({
  user: {
    id: String(user._id),
    email: user.email,
  },
  token: signAccessToken({ sub: String(user._id), email: user.email }),
});

export const registerUser = async ({ email, password }: AuthInput): Promise<AuthResult> => {
  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.exists({ email: normalizedEmail });

  if (existingUser) {
    throw new AppError("Email is already registered", HTTP_STATUS.CONFLICT);
  }

  const user = await User.create({ email: normalizedEmail, password });

  return toAuthResult(user);
};

export const loginUser = async ({ email, password }: AuthInput): Promise<AuthResult> => {
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", HTTP_STATUS.UNAUTHORIZED);
  }

  const passwordMatches = await user.comparePassword(password);

  if (!passwordMatches) {
    throw new AppError("Invalid email or password", HTTP_STATUS.UNAUTHORIZED);
  }

  return toAuthResult(user);
};
