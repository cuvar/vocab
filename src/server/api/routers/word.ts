import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { NodeLogger } from "../../../lib/logging/nodeLogger";
import {
  addWord,
  deleteWord,
  getArchived,
  getCountUnlearnedWords,
  getLearned,
  getRandomUnlearnedWord,
  getWord,
  getWordsForCollection,
  importWords,
  searchInWords,
  updateMode,
  updateWord,
} from "../../service/server/word.service";
import { getWOTD } from "../../service/server/wotd.service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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
  getAll: protectedProcedure
    .input(z.object({ collectionId: z.string() }))
    .query(async ({ input }) => {
      try {
        return await getWordsForCollection(input.collectionId);
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
  getLearned: protectedProcedure
    .input(z.object({ collectionId: z.string() }))
    .query(async ({ input }) => {
      try {
        return await getLearned(input.collectionId);
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
  getArchived: protectedProcedure
    .input(z.object({ collectionId: z.string() }))
    .query(async ({ input }) => {
      try {
        return await getArchived(input.collectionId);
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
  getAmountOfUnlearnedWords: protectedProcedure
    .input(z.object({ collectionId: z.string() }))
    .query(async ({ input }) => {
      try {
        return await getCountUnlearnedWords(input.collectionId);
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
  getRandomUnlearnedWord: protectedProcedure
    .input(z.object({ collectionId: z.string() }))
    .query(async ({ input }) => {
      try {
        return await getRandomUnlearnedWord(input.collectionId);
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
        front: z.string(),
        back: z.string(),
        notes: z.string(),
        tagIds: z.array(z.string()),
        collectionId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        return addWord(
          input.front,
          input.back,
          input.notes,
          input.collectionId,
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
        front: z.string(),
        back: z.string(),
        notes: z.string(),
        collectionId: z.string(),
        mode: z.enum(["UNLEARNED", "LEARNED", "ARCHIVED"]),
        tagIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      try {
        return await updateWord(
          input.id,
          input.front,
          input.back,
          input.notes,
          input.collectionId,
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
        collectionId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        return await importWords(input.text, input.collectionId);
      } catch (error) {
        NodeLogger.getInstance().error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
});
