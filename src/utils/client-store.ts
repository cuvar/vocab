import { type VocabularyFlashCard, type VocabularyWord } from "../types/types";

const LOCAL_STORAGE_KEY = "vocab_learned_words";

/**
 *
 * @param words
 */
export function getLearnedWords(
  words: VocabularyWord[]
): VocabularyFlashCard[] {
  const ids = getLearnedWordIds();
  const newWords: VocabularyFlashCard[] = words
    .filter((word) => ids.includes(word.id))
    .map((word) => ({
      ...word,
      mode: "good",
    }));

  return newWords;
}

/**
 *
 */
export function getLearnedWordIds() {
  const idString = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!idString) return [];
  const ids = idString.split(",").map((id) => id.trim());
  return ids;
}

/**
 *
 * @param words
 */
export function setLearnedWords(words: VocabularyWord[]) {
  const idString = words.map((word) => word.id).join(",");
  localStorage.setItem(LOCAL_STORAGE_KEY, idString);
}

/**
 *
 * @param newWord
 */
export function addLearnedWords(newWord: VocabularyWord) {
  const learnedWordIds = getLearnedWordIds();
  if (learnedWordIds.includes(newWord.id)) {
    return;
  }
  const newIds = learnedWordIds.concat(newWord.id);
  localStorage.setItem(LOCAL_STORAGE_KEY, newIds.join(","));
}

/**
 *
 * @param word
 */
export function removeLearnedWords(word: VocabularyWord) {
  const learnedWordIds = getLearnedWordIds();
  const newIds = learnedWordIds.filter((id) => id !== word.id);
  localStorage.setItem(LOCAL_STORAGE_KEY, newIds.join(","));
}

/**
 *
 */
export function clearLearnedWords() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}
