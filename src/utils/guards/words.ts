import { isBoolean, isObject, isString } from "./base";

export function isVocabularyWord(data: unknown): data is VocabularyWord {
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
  if (!isBoolean(data.c1business)) {
    return false;
  }
  if (!isBoolean(data.learned)) {
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

export function isVocabularyWordArray(data: unknown): data is VocabularyWord[] {
  return Array.isArray(data) && data.every((d) => isVocabularyWord(d));
}

export function isListElement(data: unknown): data is ListElement {
  if (!isVocabularyWord(data)) {
    return false;
  }
  if ("key" in data && !isString(data.key)) {
    return false;
  }
  if ("word" in data && !isString(data.word)) {
    return false;
  }
  if ("otherword" in data && !isString(data.otherword)) {
    return false;
  }

  return true;
}

export function isListElementArray(data: unknown): data is ListElement[] {
  return Array.isArray(data) && data.every((d) => isListElement(d));
}
