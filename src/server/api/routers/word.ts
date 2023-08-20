import { z } from "zod";
// import * as vocabData from "../../../../vocab.json";
// import * as vocabDataBusiness from "../../../../vocab-business.json";
import Fuse from "fuse.js";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const wordRouter = createTRPCRouter({
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
  getWord: publicProcedure
    .input(z.object({ word: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.word.findUnique({
        where: {
          english: input.word,
        },
      });
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
          english: true,
        },
      });

      const words = res.map((word) => word.english);

      const fuse = new Fuse(words, {
        includeScore: true,
        shouldSort: true,
      });

      const result = fuse.search(input.word);
      const resultWords = result.map((word) => word.item);

      switch (resultWords.length) {
        case 0:
          return [];
        case 1:
          return [resultWords[0]];
        case 2:
          return [resultWords[0], resultWords[1]];
        case 3:
          return [resultWords[0], resultWords[1], resultWords[2]];
        default:
          return [resultWords[0], resultWords[1], resultWords[2]];
      }
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
          english: input.word,
        },
      });

      if (!word) {
        throw new Error("Word not found");
      }

      return ctx.prisma.word.update({
        where: {
          english: word.english,
        },
        data: {
          learned: input.learned,
        },
      });
    }),
  addWord: publicProcedure
    .input(
      z.object({
        english: z.string(),
        german: z.string(),
        notes: z.string(),
        c1business: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.english === "" || input.german === "") {
        throw new Error("Empty fields");
      }
      if (input.english.length > 100 || input.german.length > 100) {
        throw new Error("Too long");
      }
      const business = input.c1business === "true";

      return ctx.prisma.word.create({
        data: {
          english: input.english,
          german: input.german,
          notes: input.notes,
          c1business: business,
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
          english: input.word,
        },
      });
    }),
});
