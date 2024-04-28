import { type LearnMode as PrismaLearnMode } from "@prisma/client";
import { isObject, isString } from "../../../lib/guards/base";
import { LearnMode } from "../server/learnMode";
import Word from "../server/word";

export type JsonImportWordData = {
  translation: string;
  native: string;
  notes: string;
  mode: PrismaLearnMode;
  iconNative: string;
  iconTranslation: string;
};

export default class JsonImportWord {
  static toWord(data: JsonImportWordData): Word {
    return new Word("", data.translation, data.native, data.notes, data.mode);
  }

  static validate(data: unknown): data is JsonImportWordData {
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

  static validateArray(data: unknown): data is JsonImportWordData[] {
    return Array.isArray(data) && data.every((d) => JsonImportWord.validate(d));
  }
}
