import { PrismaClient } from "@prisma/client";

const globalForPrisma = global;

let prisma;

if (!globalForPrisma.prima) {
    globalForPrisma.prisma = new PrismaClient({
        log: ["warn, error"]
    });
}

prisma = globalForPrisma.prisma;

export default prisma;