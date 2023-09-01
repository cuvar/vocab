import { z } from "zod";
// import * as allWords from "../../../../allwords.json";
import Fuse from "fuse.js";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

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
    const data = await ctx.prisma.word.findMany();
    const transformed = data.map((e) => {
      return {
        ...e,
        iconNative: "🇩🇪",
        iconTranslation: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      };
    });
    return transformed;
  }),
  getWordData: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.word.findMany();
  }),
  getWord: publicProcedure
    .input(z.object({ word: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.word.findUnique({
        where: {
          translation: input.word,
        },
      });
      if (data == null) {
        throw new Error("Word not found");
      }
      return {
        ...data,
        iconNative: "🇩🇪",
        iconTranslation: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      };
    }),
  getLearned: publicProcedure.query(async ({ ctx, input }) => {
    const data = await ctx.prisma.word.findMany({
      where: {
        learned: true,
      },
    });
    const transformed = data.map((e) => {
      return {
        ...e,
        iconNative: "🇩🇪",
        iconTranslation: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      };
    });
    return transformed;
  }),
  searchWord: publicProcedure
    .input(z.object({ word: z.string() }))
    .query(async ({ ctx, input }) => {
      const res = await ctx.prisma.word.findMany({
        select: {
          translation: true,
        },
      });

      const words = res.map((word) => word.translation);

      const fuse = new Fuse(words, {
        includeScore: true,
        shouldSort: true,
      });

      const result = fuse.search(input.word);
      const resultWords = result.map((word) => word.item);

      return resultWords.slice(0, Math.min(resultWords.length, 3));
    }),
  getAmountOfUnlearnedWords: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.word.count({
      where: {
        learned: false,
      },
    });
  }),
  getRandomUnlearnedWord: publicProcedure.query(async ({ ctx }) => {
    const unlearned = await ctx.prisma.word.findMany({
      where: {
        learned: false,
      },
    });

    const transformed = unlearned.map((e) => {
      return {
        ...e,
        iconNative: "🇩🇪",
        iconTranslation: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      };
    });

    // get random word from unlearned words
    const randomWord =
      transformed[Math.floor(Math.random() * unlearned.length)];
    return randomWord;
  }),
  markAsLearned: publicProcedure
    .input(z.object({ word: z.string(), learned: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const word = await ctx.prisma.word.findUnique({
        where: {
          translation: input.word,
        },
      });

      if (!word) {
        throw new Error("Word not found");
      }

      return ctx.prisma.word.update({
        where: {
          translation: word.translation,
        },
        data: {
          learned: input.learned,
        },
      });
    }),
  addWord: publicProcedure
    .input(
      z.object({
        translation: z.string(),
        native: z.string(),
        notes: z.string(),
        business: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.translation === "" || input.native === "") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Word cannot be empty",
        });
      }
      if (input.translation.length > 100 || input.native.length > 100) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Word too long",
        });
      }

      return ctx.prisma.word.create({
        data: {
          translation: input.translation,
          native: input.native,
          notes: input.notes,
          c1business: input.business,
          learned: false,
        },
      });
    }),

  deleteWord: publicProcedure
    .input(
      z.object({
        word: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.word.delete({
        where: {
          translation: input.word,
        },
      });
    }),
});
