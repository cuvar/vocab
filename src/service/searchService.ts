import Fuse from "fuse.js";
import { isListElementArray } from "../utils/guards/words";

export function searchWord(
  words: ListElement[] | VocabularyWord[],
  searched: string
) {
  if (isListElementArray(words)) {
    return searchListLement(words, searched);
  } else {
    return searchVocabularyWord(words, searched);
  }
}

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

function search(words: string[], searched: string, limit: number) {
  const fuse = new Fuse(words, {
    includeScore: true,
    shouldSort: true,
  });

  const res = fuse.search(searched).map((word) => word.item);
  const firstResults = res.slice(0, Math.min(res.length, limit));
  return firstResults;
}
