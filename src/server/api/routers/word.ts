import { z } from "zod";
// import * as allWords from "../../../../allwords.json";

import { TRPCError } from "@trpc/server";
import { searchWord } from "../../../service/searchService";
import { WordSupabaseRepository } from "../../repository/WordSupabaseRepository";
import { createTRPCRouter, publicProcedure } from "../trpc";

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
  getAll: publicProcedure.query(async ({ ctx }) => {
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
  getWord: publicProcedure
    .input(z.object({ word: z.string() }))
    .query(async ({ ctx, input }) => {
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
  getLearned: publicProcedure.query(async ({ ctx }) => {
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
  searchWord: publicProcedure
    .input(z.object({ word: z.string() }))
    .query(async ({ ctx, input }) => {
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
  getAmountOfUnlearnedWords: publicProcedure.query(async ({ ctx }) => {
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
  getRandomUnlearnedWord: publicProcedure.query(async ({ ctx }) => {
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
  markAsLearned: publicProcedure
    .input(z.object({ id: z.string().min(1), learned: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
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
  addWord: publicProcedure
    .input(
      z.object({
        translation: z.string(),
        native: z.string(),
        notes: z.string(),
        c1business: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newWord = {
        ...input,
        learned: false,
      };

      try {
        await repo.addWord(newWord);
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),

  deleteWord: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
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
  updateWord: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        translation: z.string(),
        native: z.string(),
        notes: z.string(),
        business: z.boolean(),
        learned: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newWord: FEWord = {
        translation: input.translation,
        native: input.native,
        notes: input.notes,
        c1business: input.business,
        learned: input.learned,
      };

      try {
        const res = await repo.updateWord(input.id, newWord);
        return res;
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
});
