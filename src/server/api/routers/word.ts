import { z } from "zod";
// import * as vocabData from "../../../../vocab.json";
// import * as vocabDataBusiness from "../../../../vocab-business.json";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const wordRouter = createTRPCRouter({
  // initDB: publicProcedure.mutation(({ ctx }) => {
  //   const data = vocabDataBusiness.map((word) => {
  //     return {
  //       ...word,
  //       english: word.english.toLowerCase(),
  //     };
  //   });
  //   return ctx.prisma.word.createMany({
  //     data: data,
  //     skipDuplicates: true,
  //   });
  // }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.word.findMany();
  }),
  getWord: publicProcedure
    .input(z.object({ word: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.word.findUnique({
        where: {
          english: input.word,
        },
      });
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

    // get random word from unlearned words
    const randomWord = unlearned[Math.floor(Math.random() * unlearned.length)];
    return randomWord;
  }),
  markAsLearned: publicProcedure
    .input(z.object({ word: z.string() }))
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
          learned: true,
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
});
