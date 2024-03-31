import { parseListElements } from "../../server/service/parseCache.service";
import type { ListElement } from "../../types/types";
import { KEY_ARCHIVED_WORDS } from "./keys";

/**
 * Sets the archived words in the localStorage
 * @param {ListElement[]} words The words that have been archived
 */
export function setArchivedWords(words: ListElement[]) {
  localStorage.setItem(KEY_ARCHIVED_WORDS, JSON.stringify(words));
}

/**
 * Returns the archived words
 * @returns {ListElement[]} The archived words
 */
export function getArchivedWords(): ListElement[] {
  const res = localStorage.getItem(KEY_ARCHIVED_WORDS);
  if (!res) {
    return [];
  }

  return parseListElements(res);
}