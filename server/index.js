import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerk } from "./middleware/clerkMiddleware.js";
import projectsRouter from "./routes/projects.routes.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(clerk); // attach Clerk middleware (cookies/sessions). Note: clerk is already express middleware

// health
app.get("/", (_req, res) => res.json({ status: "API is running" }));

// api routers
app.use("/api/projects", projectsRouter);

// error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
