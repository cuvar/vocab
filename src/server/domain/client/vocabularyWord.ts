import { isObject, isString } from "~/lib/guards/base";
import LearnMode from "../server/learnMode";
import Tag from "../server/tag";
import Word from "../server/word";

export default class VocabularyWord {
  id: string;
  translation: string;
  native: string;
  notes: string;
  mode: LearnMode;
  iconTranslation: string;
  iconNative: string;
  tags: Tag[];

  constructor(
    id: string,
    translation: string,
    native: string,
    notes: string,
    mode: LearnMode,
    iconTranslation: string,
    iconNative: string,
    tags: Tag[]
  ) {
    this.id = id;
    this.translation = translation;
    this.native = native;
    this.notes = notes;
    this.mode = mode;
    this.iconTranslation = iconTranslation;
    this.iconNative = iconNative;
    this.tags = tags;
  }

  static validate(data: unknown): data is VocabularyWord {
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

  static validateArray(data: unknown): data is VocabularyWord[] {
    return Array.isArray(data) && data.every((d) => VocabularyWord.validate(d));
  }

  toWord() {
    return new Word(
      this.id,
      this.translation,
      this.native,
      this.notes,
      this.mode.toPrisma()
    );
  }
}
