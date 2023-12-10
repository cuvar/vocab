import {
  type VocabularyFlashCard,
  type VocabularyWord,
} from "../../types/types";

const LEARNED_CARDS = "learned_cards";

/**
 * Returns the learned cards
 * @param {VocabularyWord[]} words The words that have been learned
 * @returns {VocabularyFlashCard[]} The learned cards
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
 *  Returns the ids of the learned cards
 * @returns {string[]} The ids of the learned cards
 */
export function getLearnedCardsIds() {
  const idString = localStorage.getItem(LEARNED_CARDS);
  if (!idString) return [];
  const ids = idString.split(",").map((id) => id.trim());
  return ids;
}

/**
 * Sets the learned cards in the localStorage
 * @param {VocabularyWord[]} words The words that have been learned
 */
export function setLearnedCards(words: VocabularyWord[]) {
  const idString = words.map((word) => word.id).join(",");
  localStorage.setItem(LEARNED_CARDS, idString);
}

/**
 * Adds a new word that has been learned to the localStorage
 * @param {VocabularyWord} newWord The word that has been learned
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
 * Removes a word that has been learned from the localStorage
 * @param {VocabularyWord} word The word that has been learned
 */
export function removeLearnedCard(word: VocabularyWord) {
  const learnedWordIds = getLearnedCardsIds();
  const newIds = learnedWordIds.filter((id) => id !== word.id);
  localStorage.setItem(LEARNED_CARDS, newIds.join(","));
}

/**
 * Clears the learned cards from the localStorage
 */
export function clearLearnedCards() {
  localStorage.removeItem(LEARNED_CARDS);
}
