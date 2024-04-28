import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { NodeLogger } from "~/lib/logging/nodeLogger";
import {
  addWord,
  deleteWord,
  getAllWords,
  getArchived,
  getCountUnlearnedWords,
  getLearned,
  getRandomUnlearnedWord,
  getWord,
  importWords,
  searchInWords,
  updateMode,
  updateWord,
} from "~/server/service/server/word.service";
import { WordSupabaseRepository } from "../../repository/WordSupabaseRepository";
import { getWOTD } from "../../service/server/wotd.service";
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
  //     console.logerror);
  //     throw new TRPCError({
  //       code: "INTERNAL_SERVER_ERROR",
  //       message: "Internal Server Error",
  //     });
  //   }
  // }),
  getAll: protectedProcedure.query(async () => {
    try {
      return await getAllWords();
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
        return await getWord(input.word);
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
      return await getLearned();
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
      return await getArchived();
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
        return await searchInWords(input.word);
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
      return await getCountUnlearnedWords();
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
      return await getRandomUnlearnedWord();
    } catch (error) {
      NodeLogger.getInstance().error(error);
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
      NodeLogger.getInstance().error(error);
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
        return await updateMode(input.id, input.mode);
      } catch (error) {
        NodeLogger.getInstance().error(error);
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
      try {
        return addWord(
          input.translation,
          input.native,
          input.notes,
          input.tagIds
        );
      } catch (error) {
        NodeLogger.getInstance().error(error);
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
        return await deleteWord(input.id);
      } catch (error) {
        NodeLogger.getInstance().error(error);
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
        return await updateWord(
          input.id,
          input.translation,
          input.native,
          input.notes,
          input.mode,
          input.tagIds
        );
      } catch (error) {
        NodeLogger.getInstance().error(error);
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
        return await importWords(input.text);
      } catch (error) {
        NodeLogger.getInstance().error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
});
