import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient({
  log: ["query", "warn", "error"],
});

export default prisma;
