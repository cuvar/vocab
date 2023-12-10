import {
  type VocabularyFlashCard,
  type VocabularyWord,
} from "../../types/types";

const LEARNED_CARDS = "learned_cards";
const UNLEARNED_CARDS = "unlearned_cards";

/**
 * Returns the learned cards
 * @param {VocabularyWord[]} words The words that have been learned
 * @param {boolean} learned Whether it should be returned from learned or unlearned store
 * @returns {VocabularyFlashCard[]} The learned cards
 */
export function getCards(
  words: VocabularyWord[],
  learned: boolean
): VocabularyFlashCard[] {
  const ids = getCardsIds(learned);
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
 * @param {boolean} learned Whether it should be returned from learned or unlearned store
 * @returns {string[]} The ids of the learned cards
 */
export function getCardsIds(learned: boolean) {
  const key = learned ? LEARNED_CARDS : UNLEARNED_CARDS;
  const idString = localStorage.getItem(key);
  if (!idString) return [];
  const ids = idString.split(",").map((id) => id.trim());
  return ids;
}

/**
 * Sets the learned cards in the localStorage
 * @param {VocabularyWord[]} words The words that have been learned
 * @param {boolean} learned Whether it should be set in learned or unlearned store
 */
export function setCards(words: VocabularyWord[], learned: boolean) {
  const idString = words.map((word) => word.id).join(",");
  const key = learned ? LEARNED_CARDS : UNLEARNED_CARDS;
  localStorage.setItem(key, idString);
}

/**
 * Adds a new word that has been learned to the localStorage
 * @param {VocabularyWord} newWord The word that has been learned
 * @param {boolean} learned Whether it should be added to learned or unlearned store
 */
export function addCard(newWord: VocabularyWord, learned: boolean) {
  const learnedWordIds = getCardsIds(learned);
  if (learnedWordIds.includes(newWord.id)) {
    return;
  }
  const newIds = learnedWordIds.concat(newWord.id);
  const key = learned ? LEARNED_CARDS : UNLEARNED_CARDS;
  localStorage.setItem(key, newIds.join(","));
}

/**
 * Removes a word that has been learned from the localStorage
 * @param {VocabularyWord} word The word that has been learned
 * @param {boolean} learned Whether it should be removed from learned or unlearned store
 */
export function removeCard(word: VocabularyWord, learned: boolean) {
  const learnedWordIds = getCardsIds(learned);
  const newIds = learnedWordIds.filter((id) => id !== word.id);
  localStorage.setItem(LEARNED_CARDS, newIds.join(","));
}

/**
 * Clears the learned cards from the localStorage
 * @param {boolean} learned Whether it should be cleared from learned or unlearned store
 */
export function clearCards(learned: boolean) {
  if (learned) {
    localStorage.removeItem(LEARNED_CARDS);
  } else {
    localStorage.removeItem(UNLEARNED_CARDS);
  }
}
