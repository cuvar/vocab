import { type LearnMode as PrismaLearnMode } from "@prisma/client";
import type Tag from "../server/tag";

export type StrippedVocabularyWord = {
  front: string;
  back: string;
  notes: string;
  mode: PrismaLearnMode;
  collectionId: string;
  tags: Tag[];
};
