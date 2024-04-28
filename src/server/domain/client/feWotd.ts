import { isDate, isObject, isString } from "../../../lib/guards/base";
import VocabularyWord from "./vocabularyWord";

export default class FEWotd {
  id: string;
  word: VocabularyWord;
  date: Date;

  constructor(id: string, word: VocabularyWord, date: Date) {
    this.id = id;
    this.word = word;
    this.date = date;
  }

  static validate(data: unknown): data is FEWotd {
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
