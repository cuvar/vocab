import { type LearnMode as PrismaLearnMode } from "@prisma/client";
import { isObject, isString } from "../../../lib/guards/base";
import { LearnMode } from "../server/learnMode";
import Tag from "../server/tag";
import Word from "../server/word";

export type VocabularyWord = {
  id: string;
  front: string;
  back: string;
  notes: string;
  mode: PrismaLearnMode;
  iconFront: string;
  iconBack: string;
  tags: Tag[];
};

/**
 *
 * @param data
 */
export function isVocabularyWord(data: unknown): data is VocabularyWord {
  if (!isObject(data)) {
    return false;
  }
  if (!isString(data.id)) {
    return false;
  }
  if (!isString(data.front)) {
    return false;
  }
  if (!isString(data.back)) {
    return false;
  }
  if (!isString(data.notes)) {
    return false;
  }
  if (!Tag.validateArray(data.tags)) {
    return false;
  }
  if (!LearnMode.validate(data.mode)) {
    return false;
  }
  if (!isString(data.iconFront)) {
    return false;
  }
  if (!isString(data.iconBack)) {
    return false;
  }
  return true;
}

/**
 *
 * @param data
 */
export function isVocabularyWordArray(data: unknown): data is VocabularyWord[] {
  return Array.isArray(data) && data.every((d) => isVocabularyWord(d));
}

/**
 *
 * @param data
 */
export function vocabularyWordToWord(data: VocabularyWord) {
  return new Word(data.id, data.front, data.back, data.notes, data.mode);
}
