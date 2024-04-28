import { isDate, isObject, isString } from "../../../lib/guards/base";
import { isVocabularyWord, type VocabularyWordData } from "./vocabularyWord";

export type FEWotd = {
  id: string;
  word: VocabularyWordData;
  date: Date;
};

/**
 *
 * @param data
 */
export function isFEWotd(data: unknown): data is FEWotd {
  if (!isObject(data)) {
    return false;
  }
  if (!isString(data.id)) {
    return false;
  }
  if (!isDate(data.date)) {
    return false;
  }
  if (!isVocabularyWord(data.word)) {
    return false;
  }
  return true;
}
