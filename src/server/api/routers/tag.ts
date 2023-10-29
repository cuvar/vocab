// import * as allWords from "../../../../allwords.json";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { type TagData } from "../../../types/types";
import { TagSupabaseRepository } from "../../repository/TagSupabaseRepository";
import { createTRPCRouter, protectedProcedure } from "../trpc";
const repo = new TagSupabaseRepository();

export const tagRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async () => {
    try {
      const res = await repo.getTags();
      return res;
    } catch {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal Server Error",
      });
    }
  }),
  getAllForWord: protectedProcedure
    .input(z.object({ wordId: z.string() }))
    .query(async ({ input }) => {
      try {
        const allTags = await repo.getTags();
        const tagsForWord = await repo.getTagsForWord(input.wordId);

        const combinedTags: TagData[] = allTags.map((t) => {
          const index = tagsForWord.findIndex((e) => e.id === t.id);
          return {
            ...t,
            checked: index >= 0,
          };
        });

        return combinedTags;
      } catch {
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
        const updatedTag = await repo.updateTag(
          input.id,
          input.name,
          input.description
        );
        return updatedTag;
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
});
