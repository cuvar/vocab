import { type ListElement } from "~/server/domain/client/listElement";
import { parseListElements } from "../../../server/service/client/parseCache.service";
import { KEY_LEARNED_WORDS } from "./keys";

/**
 * Sets the learned words in the localStorage
 * @param {ListElement[]} words The words that have been learned
 * @param collectionId
 */
export function setLearnedWords(words: ListElement[], collectionId: string) {
  localStorage.setItem(
    collectionId + "-" + KEY_LEARNED_WORDS,
    JSON.stringify(words)
  );
}

/**
 * Returns the learned words
 * @param collectionId
 * @returns {ListElement[]} The learned words
 */
export function getLearnedWords(collectionId: string): ListElement[] {
  const res = localStorage.getItem(collectionId + "-" + KEY_LEARNED_WORDS);
  if (!res) {
    return [];
  }

  return parseListElements(res);
}
