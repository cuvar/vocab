import { type LearnMode as PrismaLearnMode } from "@prisma/client";
import { isString } from "../../../lib/guards/base";
import type Tag from "../server/tag";
import VocabularyWord from "./vocabularyWord";

export type ListElement = {
  id: string;
  translation: string;
  native: string;
  notes: string;
  mode: PrismaLearnMode;
  iconTranslation: string;
  iconNative: string;
  tags: Tag[];
  word: string;
  otherWord: string;
};

/**
 *
 * @param data
 */
export function isListElement(data: unknown): data is ListElement {
  if (!VocabularyWord.validate(data)) {
    return false;
  }
  if (!("word" in data) || !isString(data.word)) {
    return false;
  }
  if (!("otherWord" in data) || !isString(data.otherWord)) {
    return false;
  }

  return true;
}

/**
 *
 * @param data
 */
export function isListElementArray(data: unknown): data is ListElement[] {
  return Array.isArray(data) && data.every((d) => isListElement(d));
}
