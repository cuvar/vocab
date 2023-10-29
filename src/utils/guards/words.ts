import {
  type JsonImportWord,
  type ListElement,
  type Tag,
  type TagData,
  type VocabularyWord,
} from "../../types/types";
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
  if (!isTagArray(data.tag)) {
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
 * Checks whether data is of type Tag
 * @param {unknown} data Unkown type to be checked
 * @returns {boolean} Whether data is of type Tag
 */
export function isTag(data: unknown): data is Tag {
  if (!isString(data)) {
    return false;
  }
  return true;
}

/**
 * Checks whether data is of type Tag[]
 * @param {unknown} data Unkown type to be checked
 * @returns {boolean} Whether data is of type Tag[]
 */
export function isTagArray(data: unknown): data is Tag[] {
  return Array.isArray(data) && data.every((d) => isTag(d));
}

/**
 * Checks whether data is of type TagData
 * @param {unknown} data Unkown type to be checked
 * @returns {boolean} Whether data is of type TagData
 */
export function isTagData(data: unknown): data is TagData {
  if (!isTag(data)) {
    return false;
  }
  if (!("checked" in data) || !isBoolean(data.checked)) {
    return false;
  }

  return true;
}

/**
 * Checks whether data is of type TagData[]
 * @param {unknown} data Unkown type to be checked
 * @returns {boolean} Whether data is of type TagData[]
 */
export function isTagDataArray(data: unknown): data is TagData[] {
  return Array.isArray(data) && data.every((d) => isTagData(d));
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

/**
 * Checks whether data is of type JsonImportWord
 * @param {unknown} data Unkown type to be checked
 * @returns {boolean} Whether data is of type JsonImportWord
 */
export function isJsonImportWord(data: unknown): data is JsonImportWord {
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
 * Checks whether data is of type JsonImportWord[]
 * @param {unknown} data Unkown type to be checked
 * @returns {boolean} Whether data is of type JsonImportWord[]
 */
export function isJsonImportWordArray(data: unknown): data is ListElement[] {
  return Array.isArray(data) && data.every((d) => isJsonImportWord(d));
}
