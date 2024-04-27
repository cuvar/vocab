import type ListElement from "~/server/domain/client/listElement";
import { parseListElements } from "../../server/service/parseCache.service";
import { KEY_LEARNED_WORDS } from "./keys";

/**
 * Sets the learned words in the localStorage
 * @param {ListElement[]} words The words that have been learned
 */
export function setLearnedWords(words: ListElement[]) {
  localStorage.setItem(KEY_LEARNED_WORDS, JSON.stringify(words));
}

/**
 * Returns the learned words
 * @returns {ListElement[]} The learned words
 */
export function getLearnedWords(): ListElement[] {
  const res = localStorage.getItem(KEY_LEARNED_WORDS);
  if (!res) {
    return [];
  }

  return parseListElements(res);
}
