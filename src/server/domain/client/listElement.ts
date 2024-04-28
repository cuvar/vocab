import { type LearnMode as PrismaLearnMode } from "@prisma/client";
import { isString } from "../../../lib/guards/base";
import type Tag from "../server/tag";
import VocabularyWord from "./vocabularyWord";

export type ListElementData = {
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

export default class ListElement {
  static validate(data: unknown): data is ListElementData {
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

  static validateArray(data: unknown): data is ListElementData[] {
    return Array.isArray(data) && data.every((d) => ListElement.validate(d));
  }
}
