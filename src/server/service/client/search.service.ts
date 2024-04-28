import Fuse from "fuse.js";
import ListElement, {
  type ListElementData,
} from "../../domain/client/listElement";
import { type VocabularyWordData } from "../../domain/client/vocabularyWord";

/**
 *
 * @param words
 * @param searched
 */
export function searchWord(
  words: ListElementData[] | VocabularyWordData[],
  searched: string
) {
  if (ListElement.validateArray(words)) {
    return searchListLement(words, searched);
  } else {
    return searchVocabularyWord(words, searched);
  }
}

/**
 *
 * @param words
 * @param searched
 */
function searchListLement(words: ListElementData[], searched: string) {
  const wordsToSearchThrough = words.map((word) => word.word);
  const searchResults = search(wordsToSearchThrough, searched, 5);

  const resultWords: ListElementData[] = [];
  searchResults.forEach((r) => {
    const res = words.find((el) => el.translation == r);
    if (res == undefined) return;
    resultWords.push(res);
  });

  return resultWords;
}

/**
 *
 * @param words
 * @param searched
 */
function searchVocabularyWord(words: VocabularyWordData[], searched: string) {
  const wordsToSearchThrough = words.map((word) => word.translation);
  const searchResults = search(wordsToSearchThrough, searched, 3);

  const resultWords: VocabularyWordData[] = [];
  searchResults.forEach((r) => {
    const res = words.find((el) => el.translation == r);
    if (res == undefined) return;
    resultWords.push(res);
  });

  return resultWords;
}

/**
 *
 * @param words
 * @param searched
 * @param limit
 */
function search(words: string[], searched: string, limit: number) {
  const fuse = new Fuse(words, {
    includeScore: true,
    shouldSort: true,
  });

  const res = fuse.search(searched).map((word) => word.item);
  const firstResults = res.slice(0, Math.min(res.length, limit));
  return firstResults;
}
