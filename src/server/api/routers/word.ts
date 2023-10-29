import { z } from "zod";
// import * as allWords from "../../../../allwords.json";
import { TRPCError } from "@trpc/server";
import { searchWord } from "../../../service/searchService";
import { WordSupabaseRepository } from "../../repository/WordSupabaseRepository";
import { createTRPCRouter, protectedProcedure } from "../trpc";
const repo = new WordSupabaseRepository();

export const wordRouter = createTRPCRouter({
  // initDB: publicProcedure.mutation(async ({ ctx }) => {
  //   const chunkSize = 100;
  //   const chunks = allWords.length / chunkSize;
  //   for (let i = 0; i < chunks; i++) {
  //     const chunk = allWords.slice(i * chunkSize, (i + 1) * chunkSize);
  //     await ctx.prisma.word.createMany({
  //       data: [...chunk],
  //     });
  //   }
  // }),
  // backupAll: protectedProcedure.query(async () => {
  //   try {
  //     const res = await repo.getWords();
  //     fs.writeFileSync("words.json", JSON.stringify(res, null, 2));
  //     return res;
  //   } catch {
  //     throw new TRPCError({
  //       code: "INTERNAL_SERVER_ERROR",
  //       message: "Internal Server Error",
  //     });
  //   }
  // }),
  getAll: protectedProcedure.query(async () => {
    try {
      const res = await repo.getWords();
      return res;
    } catch {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal Server Error",
      });
    }
  }),
  getWord: protectedProcedure
    .input(z.object({ word: z.string() }))
    .query(async ({ input }) => {
      try {
        const res = await repo.getWord(input.word);
        return res;
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
  getLearned: protectedProcedure.query(async () => {
    try {
      const learned = await repo.getWordsByFilter("", { learned: true });
      return learned;
    } catch {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal Server Error",
      });
    }
  }),
  searchWord: protectedProcedure
    .input(z.object({ word: z.string() }))
    .query(async ({ input }) => {
      try {
        const res = await repo.getWords();
        return searchWord(res, input.word);
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
  getAmountOfUnlearnedWords: protectedProcedure.query(async () => {
    try {
      const res = await repo.getCountByFilter({ learned: false });
      return res;
    } catch {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal Server Error",
      });
    }
  }),
  getRandomUnlearnedWord: protectedProcedure.query(async () => {
    try {
      const unlearned = await repo.getWordsByFilter("", { learned: false });
      const randomWord =
        unlearned[Math.floor(Math.random() * unlearned.length)];
      return randomWord;
    } catch {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal Server Error",
      });
    }
  }),
  markAsLearned: protectedProcedure
    .input(z.object({ id: z.string().min(1), learned: z.boolean() }))
    .mutation(async ({ input }) => {
      try {
        const res = await repo.updateLearned(input.id, input.learned);
        return res;
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
  addWord: protectedProcedure
    .input(
      z.object({
        translation: z.string(),
        native: z.string(),
        notes: z.string(),
        tagIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const newWord = {
        ...input,
        learned: false,
      };

      try {
        const res = await repo.addWord(newWord);
        return res;
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),

  deleteWord: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const res = await repo.deleteWord(input.id);
        return res;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
  updateWord: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        translation: z.string(),
        native: z.string(),
        notes: z.string(),
        learned: z.boolean(),
        tagIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const res = await repo.updateWord(input.id, input);
        return res;
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
});
