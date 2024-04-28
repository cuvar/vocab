import { type LearnMode as PrismaLearnMode } from "@prisma/client";
import { isObject, isString } from "../../../lib/guards/base";
import { LearnMode } from "../server/learnMode";
import Tag from "../server/tag";
import Word from "../server/word";

export type VocabularyWord = {
  id: string;
  translation: string;
  native: string;
  notes: string;
  mode: PrismaLearnMode;
  iconTranslation: string;
  iconNative: string;
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
  if (!isString(data.translation)) {
    return false;
  }
  if (!isString(data.native)) {
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
  if (!isString(data.iconTranslation)) {
    return false;
  }
  if (!isString(data.iconNative)) {
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
  return new Word(
    data.id,
    data.translation,
    data.native,
    data.notes,
    data.mode
  );
}
