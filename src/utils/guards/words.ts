import { ListElement, VocabularyWord } from "../../types/types";
import { isBoolean, isObject, isString } from "./base";

/**
 * Checks whether data is of type VocabularyWord
 * @param {unknown} data Unkown type to be checked
 * @returns {boolean} Whether data is of type VocabularyWord
 */
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

/**
 * Checks whether data is of type VocabularyWord[]
 * @param {unknown} data Unkown type to be checked
 * @returns {boolean} Whether data is of type VocabularyWord[]
 */
export function isVocabularyWordArray(data: unknown): data is VocabularyWord[] {
  return Array.isArray(data) && data.every((d) => isVocabularyWord(d));
}

/**
 * Checks whether data is of type ListElement
 * @param {unknown} data Unkown type to be checked
 * @returns {boolean} Whether data is of type ListElement
 */
export function isListElement(data: unknown): data is ListElement {
  if (!isVocabularyWord(data)) {
    return false;
  }
  if (!("key" in data) || !isString(data.key)) {
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

/**
 * Checks whether data is of type ListElement[]
 * @param {unknown} data Unkown type to be checked
 * @returns {boolean} Whether data is of type ListElement[]
 */
export function isListElementArray(data: unknown): data is ListElement[] {
  return Array.isArray(data) && data.every((d) => isListElement(d));
}
