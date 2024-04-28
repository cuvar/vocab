import { type LearnMode as PrismaLearnMode } from "@prisma/client";
import type Tag from "../server/tag";

export type FlashCardMode = "good" | "bad" | "none";

export type VocabularyFlashCard = {
  id: string;
  translation: string;
  native: string;
  notes: string;
  mode: PrismaLearnMode;
  iconTranslation: string;
  iconNative: string;
  tags: Tag[];
  cardMode: FlashCardMode;
  switched: boolean;
};
