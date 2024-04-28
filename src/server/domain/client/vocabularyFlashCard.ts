import { type LearnMode as PrismaLearnMode } from "@prisma/client";
import type Tag from "../server/tag";

export type FlashCardMode = "good" | "bad" | "none";

export type VocabularyFlashCard = {
  id: string;
  front: string;
  back: string;
  notes: string;
  mode: PrismaLearnMode;
  iconFront: string;
  iconBack: string;
  tags: Tag[];
  cardMode: FlashCardMode;
  switched: boolean;
};
