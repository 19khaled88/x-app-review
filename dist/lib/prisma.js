"use strict";
// import { PrismaClient } from '@prisma/client'
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
let prisma;
if (process.env.NODE_ENV === "production") {
    // Production ( Edge + Accelerate )
    const { PrismaClient } = require("@prisma/client/edge");
    const { withAccelerate } = require("@prisma/extension-accelerate");
    exports.prisma = prisma = new PrismaClient().$extends(withAccelerate());
}
else {
    // 🧩 Development (standard Prisma client, avoid multiple instances)
    const { PrismaClient } = require("@prisma/client");
    const globalForPrisma = globalThis;
    exports.prisma = prisma = globalForPrisma.prisma ?? new PrismaClient();
    if (process.env.NODE_ENV !== "production") {
        globalForPrisma.prisma = prisma;
    }
}
//# sourceMappingURL=prisma.js.map