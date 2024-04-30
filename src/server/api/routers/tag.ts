// import * as allWords from "../../../../allwords.json";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  addTag,
  deleteTag,
  getTags,
  getTagsForWord,
  updateTag,
} from "../../../server/service/server/tag.service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const tagRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ collectionId: z.string() }))
    .query(async ({ input }) => {
      try {
        return await getTags(input.collectionId);
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
  getAllForWord: protectedProcedure
    .input(z.object({ wordId: z.string(), collectionId: z.string() }))
    .query(async ({ input }) => {
      try {
        return await getTagsForWord(input.wordId, input.collectionId);
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
  updateTag: protectedProcedure
    .input(
      z.object({ id: z.string(), name: z.string(), description: z.string() })
    )
    .mutation(async ({ input }) => {
      try {
        return await updateTag(input.id, input.name, input.description);
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
  addTag: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        collectionId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        return await addTag(input.name, input.description, input.collectionId);
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
  deleteTag: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        return await deleteTag(input.id);
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
});
