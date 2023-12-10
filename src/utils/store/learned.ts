import type { ListElement } from "../../types/types";
import { parseListElements } from "../../service/parseCache.service";

const LEARNED_WORDS = "learned_words";

/**
 * Sets the learned words in the localStorage
 * @param {ListElement[]} words The words that have been learned
 */
export function setLearnedWords(words: ListElement[]) {
  localStorage.setItem(LEARNED_WORDS, JSON.stringify(words));
}

/**
 * Returns the learned words
 * @returns {ListElement[]} The learned words
 */
export function getLearnedWords(): ListElement[] {
  const res = localStorage.getItem(LEARNED_WORDS);
  if (!res) {
    return [];
  }

  return parseListElements(res);
}
