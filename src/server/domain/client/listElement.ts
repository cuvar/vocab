import { isString } from "~/lib/guards/base";
import type LearnMode from "../server/learnMode";
import type Tag from "../server/tag";
import VocabularyWord from "./vocabularyWord";

export default class ListElement implements VocabularyWord {
  id: string;
  translation: string;
  native: string;
  notes: string;
  mode: LearnMode;
  iconTranslation: string;
  iconNative: string;
  tags: Tag[];
  word: string;
  otherWord: string;

  constructor(
    id: string,
    translation: string,
    native: string,
    notes: string,
    mode: LearnMode,
    iconTranslation: string,
    iconNative: string,
    tags: Tag[],
    word: string,
    otherWord: string
  ) {
    this.id = id;
    this.translation = translation;
    this.native = native;
    this.notes = notes;
    this.mode = mode;
    this.iconTranslation = iconTranslation;
    this.iconNative = iconNative;
    this.tags = tags;
    this.word = word;
    this.otherWord = otherWord;
  }

  static validate(data: unknown): data is ListElement {
    if (!VocabularyWord.validate(data)) {
      return false;
    }
    if (!("word" in data) || !isString(data.word)) {
      return false;
    }
    if (!("otherword" in data) || !isString(data.otherword)) {
      return false;
    }

    return true;
  }

  static validateArray(data: unknown): data is ListElement[] {
    return Array.isArray(data) && data.every((d) => ListElement.validate(d));
  }
}
