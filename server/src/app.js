import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";
import ApiResponse from "./utils/ApiResponse.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import corsOptions from "./config/cors.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(cookieParser());

import authRoutes from "./modules/auth/auth.route.js";
import postRoutes from "./modules/post/post.route.js";

// routes
app.get("/", (req, res) => {
  res.json(new ApiResponse(200, "Welcome to the API", {}));
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes);

app.use("*name", errorHandler);

export default app;
