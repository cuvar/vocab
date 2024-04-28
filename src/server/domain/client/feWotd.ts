import { isDate, isObject, isString } from "../../../lib/guards/base";
import VocabularyWord, { type VocabularyWordData } from "./vocabularyWord";

export type FEWotdData = {
  id: string;
  word: VocabularyWordData;
  date: Date;
};
export default class FEWotd {
  static validate(data: unknown): data is FEWotdData {
    if (!isObject(data)) {
      return false;
    }
    if (!isString(data.id)) {
      return false;
    }
    if (!isDate(data.date)) {
      return false;
    }
    if (!VocabularyWord.validate(data.word)) {
      return false;
    }
    return true;
  }
}
