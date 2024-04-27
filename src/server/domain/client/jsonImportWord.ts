import { isObject, isString } from "~/lib/guards/base";
import LearnMode from "../server/learnMode";
import Word from "../server/word";

export default class JsonImportWord {
  translation: string;
  native: string;
  notes: string;
  mode: LearnMode;
  iconNative: string;
  iconTranslation: string;

  constructor(
    translation: string,
    native: string,
    notes: string,
    mode: LearnMode,
    iconNative: string,
    iconTranslation: string
  ) {
    this.translation = translation;
    this.native = native;
    this.notes = notes;
    this.mode = mode;
    this.iconNative = iconNative;
    this.iconTranslation = iconTranslation;
  }

  toWord(): Word {
    return new Word(
      "",
      this.translation,
      this.native,
      this.notes,
      this.mode.toPrisma()
    );
  }

  static validate(data: unknown): data is JsonImportWord {
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

  static validateArray(data: unknown): data is JsonImportWord[] {
    return Array.isArray(data) && data.every((d) => JsonImportWord.validate(d));
  }
}
