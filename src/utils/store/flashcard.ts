import {
  type VocabularyFlashCard,
  type VocabularyWord,
} from "../../types/types";

const LEARNED_CARDS = "learned_cards";

/**
 *
 * @param words
 */
export function getLearnedCards(
  words: VocabularyWord[]
): VocabularyFlashCard[] {
  const ids = getLearnedCardsIds();
  const newWords: VocabularyFlashCard[] = words
    .filter((word) => ids.includes(word.id))
    .map((word) => ({
      ...word,
      cardMode: "good",
      switched: false,
    }));

  return newWords;
}

/**
 *
 */
export function getLearnedCardsIds() {
  const idString = localStorage.getItem(LEARNED_CARDS);
  if (!idString) return [];
  const ids = idString.split(",").map((id) => id.trim());
  return ids;
}

/**
 *
 * @param words
 */
export function setLearnedCards(words: VocabularyWord[]) {
  const idString = words.map((word) => word.id).join(",");
  localStorage.setItem(LEARNED_CARDS, idString);
}

/**
 *
 * @param newWord
 */
export function addLearnedCard(newWord: VocabularyWord) {
  const learnedWordIds = getLearnedCardsIds();
  if (learnedWordIds.includes(newWord.id)) {
    return;
  }
  const newIds = learnedWordIds.concat(newWord.id);
  localStorage.setItem(LEARNED_CARDS, newIds.join(","));
}

/**
 *
 * @param word
 */
export function removeLearnedWords(word: VocabularyWord) {
  const learnedWordIds = getLearnedCardsIds();
  const newIds = learnedWordIds.filter((id) => id !== word.id);
  localStorage.setItem(LEARNED_CARDS, newIds.join(","));
}

/**
 *
 */
export function clearLearnedCards() {
  localStorage.removeItem(LEARNED_CARDS);
}
