import type { ListElement } from "../../types/types";
import { parseListElements } from "../../service/parseCache.service";

const KEY_ALL_WORDS = "all_words";

export function setAllWords(words: ListElement[]) {
  localStorage.setItem(KEY_ALL_WORDS, JSON.stringify(words));
}

// used
export function getAllWords(): ListElement[] {
  const res = localStorage.getItem(KEY_ALL_WORDS);
  if (!res) {
    return [];
  }

  return parseListElements(res);
}
