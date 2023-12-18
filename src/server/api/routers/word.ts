import { LearnMode } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { searchWord } from "../../../service/search.service";
import { getWOTD } from "../../../service/wotd.service";
import AppError from "../../../utils/error";
import { isJsonImportWordArray } from "../../../utils/guards/words";
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
  // dbaction2: protectedProcedure.query(async () => {
  // try {
  //   const a = JSON.parse(fs.readFileSync("words.json").toString());
  //   const learned = a
  //     .filter((a) => a.learned)
  //     .map((a) => {
  //       return {
  //         id: a.id,
  //         learned: "LEARNED",
  //       };
  //     });

  // await prisma?.word.updateMany({
  //   where: {
  //     id: {
  //       in: learned.map((e) => e.id),
  //     },
  //   },
  //   data: {
  //     mode: "LEARNED",
  //   },
  // });
  //   } catch (error) {
  //     Log(error);
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
    } catch (error) {
      console.error(error);
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
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
  getLearned: protectedProcedure.query(async () => {
    try {
      const learned = await repo.getWordsByFilter({
        mode: LearnMode.LEARNED,
      });
      return learned;
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal Server Error",
      });
    }
  }),
  getArchived: protectedProcedure.query(async () => {
    try {
      const learned = await repo.getWordsByFilter({
        mode: LearnMode.ARCHIVED,
      });
      return learned;
    } catch (error) {
      console.error(error);
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
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
  getAmountOfUnlearnedWords: protectedProcedure.query(async () => {
    try {
      const res = await repo.getCountByFilter({ mode: LearnMode.UNLEARNED });
      return res;
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal Server Error",
      });
    }
  }),
  getRandomUnlearnedWord: protectedProcedure.query(async () => {
    try {
      const unlearned = await repo.getWordsByFilter({
        mode: LearnMode.UNLEARNED,
      });
      const randomWord =
        unlearned[Math.floor(Math.random() * unlearned.length)];
      return randomWord;
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal Server Error",
      });
    }
  }),
  getWordOfTheDay: protectedProcedure.query(async () => {
    try {
      const wotd = await getWOTD();
      return wotd;
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal Server Error",
      });
    }
  }),
  updateMode: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        mode: z.enum(["UNLEARNED", "LEARNED", "ARCHIVED"]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const res = await repo.updateMode(input.id, input.mode);
        return res;
      } catch (error) {
        console.error(error);
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
        mode: LearnMode.UNLEARNED,
      };

      try {
        const res = await repo.addWord(newWord);
        return res;
      } catch (error) {
        console.error(error);
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
      } catch (error) {
        console.error(error);
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
        mode: z.enum(["UNLEARNED", "LEARNED", "ARCHIVED"]),
        tagIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const res = await repo.updateWord(input.id, input);
        return res;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
  importWords: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const parsed = JSON.parse(input.text) as string;
        if (!isJsonImportWordArray(parsed)) {
          throw new AppError("Input is in wrong format");
        }

        const res = await repo.importWords(parsed);
        return res;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
});
