// import { PrismaClient } from '@prisma/client'

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
// }

// export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// if (process.env.NODE_ENV !== 'production') {
//   globalForPrisma.prisma = prisma
// }

import type { PrismaClient as PrismaEdgeClient } from "@prisma/client/edge";
import type { PrismaClient as PrismaNodeClient } from "@prisma/client";

let prisma: PrismaEdgeClient | PrismaNodeClient;

if (process.env.NODE_ENV === "production") {
  // Production ( Edge + Accelerate )
  const { PrismaClient } = require("@prisma/client/edge");
  const { withAccelerate } = require("@prisma/extension-accelerate");
  prisma = new PrismaClient().$extends(withAccelerate());
} else {
  // 🧩 Development (standard Prisma client, avoid multiple instances)
  const { PrismaClient } = require("@prisma/client");
  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaNodeClient | undefined;
  };

  prisma = globalForPrisma.prisma ?? new PrismaClient();

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }
}

export {prisma};
