import { PrismaClient } from "@prisma/client";

// import { env } from "@vocab/web/src/env/server.mjs";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log:
      // env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      ["query", "error", "warn"],
  });

// TODO: fix this
// if (env.NODE_ENV !== "production") {
//   global.prisma = prisma;
// }
