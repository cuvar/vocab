import { type LearnMode as PrismaLearnMode } from "@prisma/client";
import type Tag from "../server/tag";

export type StrippedVocabularyWord = {
  translation: string;
  native: string;
  notes: string;
  mode: PrismaLearnMode;
  tags: Tag[];
};
