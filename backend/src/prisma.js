import { PrismaClient } from "@prisma/client";

// Singleton pattern - Chỉ tạo 1 instance duy nhất
const globalForPrisma = global;

let prisma;

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    log: ["warn", "error"], // Chỉ log warning + error
  });
}

prisma = globalForPrisma.prisma;

export default prisma;
