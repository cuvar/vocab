import { type LearnMode as PrismaLearnMode } from "@prisma/client";
import { isString } from "../../../lib/guards/base";
import type Tag from "../server/tag";
import { isVocabularyWord } from "./vocabularyWord";

export type ListElement = {
  id: string;
  front: string;
  back: string;
  notes: string;
  mode: PrismaLearnMode;
  iconFront: string;
  iconBack: string;
  tags: Tag[];
  word: string;
  otherWord: string;
};

/**
 *
 * @param data
 */
export function isListElement(data: unknown): data is ListElement {
  if (!isVocabularyWord(data)) {
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
