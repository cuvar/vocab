import { type LearnMode as PrismaLearnMode } from "@prisma/client";
import type Tag from "../server/tag";
import type Word from "../server/word";
import type VocabularyWord from "./vocabularyWord";

export type FlashCardMode = "good" | "bad" | "none";

export default class VocabularyFlashCard implements VocabularyWord {
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

  constructor(
    id: string,
    translation: string,
    native: string,
    notes: string,
    mode: PrismaLearnMode,
    iconTranslation: string,
    iconNative: string,
    tags: Tag[],
    cardMode: FlashCardMode,
    switched: boolean
  ) {
    this.id = id;
    this.translation = translation;
    this.native = native;
    this.notes = notes;
    this.mode = mode;
    this.iconTranslation = iconTranslation;
    this.iconNative = iconNative;
    this.tags = tags;
    this.cardMode = cardMode;
    this.switched = switched;
  }
  toWord(): Word {
    throw new Error("Method not implemented.");
  }
}
