import { tagRouter } from "./router/tag";
import { wordRouter } from "./router/word";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  word: wordRouter,
  tag: tagRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
