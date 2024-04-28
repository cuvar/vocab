import { type LearnMode as PrismaLearnMode } from "@prisma/client";
import type Tag from "../server/tag";

export type StrippedVocabularyWordData = {
  translation: string;
  native: string;
  notes: string;
  mode: PrismaLearnMode;
  tags: Tag[];
};
