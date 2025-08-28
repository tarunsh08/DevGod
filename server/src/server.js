import "./config/env.js";
import app from "./app.js";
import prisma from "./config/db.js";
import http from "http";
import logger from "./config/logger.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const shutdown = async () => {
  logger.info("Shutting down...");
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

server.listen(PORT, () => {
  logger.info(`Server listening on http://localhost:${PORT}`);
});
