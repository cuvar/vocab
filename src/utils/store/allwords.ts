import { parseListElements } from "../../server/service/parseCache.service";
import type { ListElement } from "../../types/types";
import { KEY_ALL_WORDS } from "./keys";

/**
 * Sets the learned words in the localStorage
 * @param {ListElement[]} words The words that have been learned
 */
export function setAllWords(words: ListElement[]) {
  localStorage.setItem(KEY_ALL_WORDS, JSON.stringify(words));
}

/**
 * Returns the learned words
 * @returns {ListElement[]} The learned words
 */
export function getAllWords(): ListElement[] {
  const res = localStorage.getItem(KEY_ALL_WORDS);
  if (!res) {
    return [];
  }

  return parseListElements(res);
}
