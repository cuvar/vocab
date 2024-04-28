import type ListElement from "../../../server/domain/client/listElement";
import { type ListElementData } from "../../../server/domain/client/listElement";
import { parseListElements } from "../../../server/service/client/parseCache.service";
import { KEY_ARCHIVED_WORDS } from "./keys";

/**
 * Sets the archived words in the localStorage
 * @param {ListElement[]} words The words that have been archived
 */
export function setArchivedWords(words: ListElementData[]) {
  localStorage.setItem(KEY_ARCHIVED_WORDS, JSON.stringify(words));
}

/**
 * Returns the archived words
 * @returns {ListElement[]} The archived words
 */
export function getArchivedWords(): ListElementData[] {
  const res = localStorage.getItem(KEY_ARCHIVED_WORDS);
  if (!res) {
    return [];
  }

  return parseListElements(res);
}
