import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/notFound.middleware.js";
import { rateLimit } from "./middleware/rateLimit.middleware.js";
import routes from "./routes/index.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 200 }));

if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}
app.get("/", (req, res) => {
  res.send("Welcome to the Notes API");
});
app.use("/api/v1", routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
