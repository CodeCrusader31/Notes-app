import type { RequestHandler } from "express";

import { HTTP_STATUS } from "../constants/httpStatus.js";
import { AppError } from "../errors/AppError.js";

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitRecord>();

export const rateLimit = ({ windowMs, maxRequests }: RateLimitOptions): RequestHandler => {
  return (req, _res, next) => {
    const now = Date.now();
    const key = req.ip ?? req.socket.remoteAddress ?? "unknown";
    const current = store.get(key);

    if (!current || current.resetAt <= now) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (current.count >= maxRequests) {
      next(new AppError("Too many requests. Please try again later.", HTTP_STATUS.TOO_MANY_REQUESTS));
      return;
    }

    current.count += 1;
    store.set(key, current);
    next();
  };
};
