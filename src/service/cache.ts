/* eslint-disable jsdoc/require-jsdoc */
import type { ListElement } from "../types/types";
import { isListElement } from "../utils/guards/words";

const KEY_ALL_WORDS = "all_words";
const LEARNED_WORDS = "learned_words";
export function setAllWords(words: ListElement[]) {
  localStorage.setItem(KEY_ALL_WORDS, JSON.stringify(words));
}

export function getAllWords(): ListElement[] {
  const res = localStorage.getItem(KEY_ALL_WORDS);
  if (!res) {
    return [];
  }

  return parseListElements(res);
}

export function setLearnedWords(words: ListElement[]) {
  localStorage.setItem(LEARNED_WORDS, JSON.stringify(words));
}

export function getLearnedWords(): ListElement[] {
  const res = localStorage.getItem(LEARNED_WORDS);
  if (!res) {
    return [];
  }

  return parseListElements(res);
}

function parseListElements(input: string): ListElement[] {
  const parsed = JSON.parse(input) as unknown;
  if (!Array.isArray(parsed)) {
    return [];
  }
  const validOutput = parsed.every((item) => {
    isListElement(item);
  });

  if (!validOutput) {
    return [];
  }
  return parsed as ListElement[];
}
