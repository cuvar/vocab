import type { ListElement } from "../../types/types";
import { parseListElements } from "../../service/parseCache.service";

const LEARNED_WORDS = "learned_words";

// used in learned
export function setLearnedWords(words: ListElement[]) {
  localStorage.setItem(LEARNED_WORDS, JSON.stringify(words));
}

// used in learned
export function getLearnedWords(): ListElement[] {
  const res = localStorage.getItem(LEARNED_WORDS);
  if (!res) {
    return [];
  }

  return parseListElements(res);
}
