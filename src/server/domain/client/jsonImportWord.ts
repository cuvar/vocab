import { type LearnMode as PrismaLearnMode } from "@prisma/client";
import { isObject, isString } from "../../../lib/guards/base";
import { LearnMode } from "../server/learnMode";
import Word from "../server/word";

export type JsonImportWord = {
  translation: string;
  native: string;
  notes: string;
  mode: PrismaLearnMode;
  iconNative: string;
  iconTranslation: string;
};

/**
 *
 * @param data
 */
export function jsonImportWordToWord(data: JsonImportWord): Word {
  return new Word("", data.translation, data.native, data.notes, data.mode);
}

/**
 *
 * @param data
 */
export function isJsonImportWord(data: unknown): data is JsonImportWord {
  if (!isObject(data)) {
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
export function isJsonImportWordArray(data: unknown): data is JsonImportWord[] {
  return Array.isArray(data) && data.every((d) => isJsonImportWord(d));
}
