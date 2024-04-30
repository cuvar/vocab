import { type ListElement } from "~/server/domain/client/listElement";
import { parseListElements } from "../../../server/service/client/parseCache.service";
import { KEY_ARCHIVED_WORDS } from "./keys";

/**
 * Sets the archived words in the localStorage
 * @param {ListElement[]} words The words that have been archived
 * @param collectionId
 */
export function setArchivedWords(words: ListElement[], collectionId: string) {
  localStorage.setItem(
    collectionId + "-" + KEY_ARCHIVED_WORDS,
    JSON.stringify(words)
  );
}

/**
 * Returns the archived words
 * @param collectionId
 * @returns {ListElement[]} The archived words
 */
export function getArchivedWords(collectionId: string): ListElement[] {
  const res = localStorage.getItem(collectionId + "-" + KEY_ARCHIVED_WORDS);
  if (!res) {
    return [];
  }

  return parseListElements(res);
}
