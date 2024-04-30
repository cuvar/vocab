import { type LearnMode as PrismaLearnMode } from "@prisma/client";
import { isObject, isString } from "../../../lib/guards/base";
import { LearnMode } from "../server/learnMode";
import Word from "../server/word";

export type JsonImportWord = {
  front: string;
  back: string;
  notes: string;
  mode: PrismaLearnMode;
  iconBack: string;
  iconFront: string;
};

/**
 *
 * @param data
 */
export function jsonImportWordToWord(data: JsonImportWord): Word {
  return new Word("", data.front, data.back, data.notes, data.mode, "");
}

/**
 *
 * @param data
 */
export function isJsonImportWord(data: unknown): data is JsonImportWord {
  if (!isObject(data)) {
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
export function isJsonImportWordArray(data: unknown): data is JsonImportWord[] {
  return Array.isArray(data) && data.every((d) => isJsonImportWord(d));
}
