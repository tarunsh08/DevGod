import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { clerkMiddleware } from "@clerk/express";

const app = express();

// Initialize Prisma Client
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// async function main() {
//   try {
//     await prisma.$connect();
//     console.log('Successfully connected to the database');
//   } catch (error) {
//     console.error('Error connecting to the database:', error);
//     process.exit(1);
//   }
// }

// main().catch(console.error);

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
