import { TRPCError } from "@trpc/server";
import { getAllCollections } from "~/server/service/server/collection.service";
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
});
