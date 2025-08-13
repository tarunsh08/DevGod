import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { clerkMiddleware, getAuth } from "@clerk/express";
import "dotenv/config";

const app = express();
const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware()); // attaches req.auth

app.get("/", (_req, res) => res.json({ status: "API is running..." }));

// Cross-origin API style (recommended for APIs)
app.get("/api/me", (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  return res.json({ userId, message: "You have access to this protected route" });
});

// Same-origin full-stack apps can also use requireAuth() (redirects if unauth)
/// app.get("/protected", requireAuth(), (req, res) => res.send("ok"));

app.use((err, _req, res, _next) => res.status(500).json({ error: "Something went wrong!" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
