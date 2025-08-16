import express from "express";
import cors from "cors";
import "dotenv/config";
import projectsRouter from "./routes/projects.routes.js";

const app = express();

// middlewares
app.use(cors({
  origin: true, 
  credentials: true 
}));
app.use(express.json());

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
