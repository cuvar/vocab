import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  addCollection,
  deleteCollection,
  getAllCollections,
} from "~/server/service/server/collection.service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const collectionRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async () => {
    try {
      return await getAllCollections();
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal Server Error",
      });
    }
  }),
  add: protectedProcedure
    .input(z.object({ name: z.string(), description: z.string() }))
    .mutation(async ({ input }) => {
      try {
        if (!input.name.trim().length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Name and description are required",
          });
        }
        return await addCollection(input.name.trim(), input.description.trim());
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
  delete: protectedProcedure
    .input(z.object({ collectionId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        return await deleteCollection(input.collectionId);
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
});
