import { type LearnMode as PrismaLearnMode } from "@prisma/client";
import type Tag from "../server/tag";

export default class StrippedVocabularyWord {
  translation: string;
  native: string;
  notes: string;
  mode: PrismaLearnMode;
  tags: Tag[];

  constructor(
    translation: string,
    native: string,
    notes: string,
    mode: PrismaLearnMode,
    tags: Tag[]
  ) {
    this.translation = translation;
    this.native = native;
    this.notes = notes;
    this.mode = mode;
    this.tags = tags;
  }
}
