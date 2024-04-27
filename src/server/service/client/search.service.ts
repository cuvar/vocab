import Fuse from "fuse.js";
import ListElement from "../../domain/client/listElement";
import type VocabularyWord from "../../domain/client/vocabularyWord";

/**
 *
 * @param words
 * @param searched
 */
export function searchWord(
  words: ListElement[] | VocabularyWord[],
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
function searchListLement(words: ListElement[], searched: string) {
  console.log(words[0]);
  const wordsToSearchThrough = words.map((word) => word.word);
  const searchResults = search(wordsToSearchThrough, searched, 5);

  const resultWords: ListElement[] = [];
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
function searchVocabularyWord(words: VocabularyWord[], searched: string) {
  const wordsToSearchThrough = words.map((word) => word.translation);
  const searchResults = search(wordsToSearchThrough, searched, 3);

  const resultWords: VocabularyWord[] = [];
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
