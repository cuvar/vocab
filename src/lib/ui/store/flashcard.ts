import { type VocabularyFlashCard } from "~/server/domain/client/vocabularyFlashCard";
import { type VocabularyWord } from "../../../server/domain/client/vocabularyWord";
import { KEY_LEARNED_CARDS } from "./keys";

/**
 * Returns the learned cards
 * @param {VocabularyWord[]} words The words that have been learned
 * @param {boolean} learned Whether it should be returned from learned or unlearned store
 * @param collectionId
 * @returns {VocabularyFlashCard[]} The learned cards
 */
export function getCards(
  words: VocabularyWord[],
  learned: boolean,
  collectionId: string
): VocabularyFlashCard[] {
  const ids = getCardsIds(learned, collectionId);
  const newWords: VocabularyFlashCard[] = words
    .filter((word) => ids.includes(word.id))
    .map((word) => {
      return {
        id: word.id,
        front: word.front,
        back: word.back,
        notes: word.notes,
        mode: word.mode,
        iconFront: word.iconFront,
        iconBack: word.iconBack,
        tags: word.tags,
        cardMode: "good",
        switched: false,
      } as VocabularyFlashCard;
    });

  return newWords;
}

/**
 *  Returns the ids of the learned cards
 * @param {boolean} learned Whether it should be returned from learned or unlearned store
 * @param collectionId
 * @returns {string[]} The ids of the learned cards
 */
export function getCardsIds(learned: boolean, collectionId: string) {
  const idString = localStorage.getItem(collectionId + "-" + getKey(learned));
  if (!idString) return [];
  const ids = idString.split(",").map((id) => id.trim());
  return ids;
}

/**
 * Adds a new word that has been learned to the localStorage
 * @param {VocabularyWord} newWord The word that has been learned
 * @param {boolean} learned Whether it should be added to learned or unlearned store
 * @param collectionId
 */
export function addCard(
  newWord: VocabularyWord,
  learned: boolean,
  collectionId: string
) {
  const learnedWordIds = getCardsIds(learned, collectionId);
  if (learnedWordIds.includes(newWord.id)) {
    return;
  }
  const newIds = learnedWordIds.concat(newWord.id);
  localStorage.setItem(collectionId + "-" + getKey(learned), newIds.join(","));
}

/**
 * Clears the learned cards from the localStorage
 * @param {boolean} learned Whether it should be cleared from learned or unlearned store
 * @param collectionId
 */
export function clearCards(learned: boolean, collectionId: string) {
  localStorage.removeItem(collectionId + "-" + getKey(learned));
}

/**
 * Returns the key for the localStorage
 * @param {boolean} chooseLearned Whether it should be returned from learned or unlearned store
 * @returns {string} The key for the localStorage
 */
function getKey(chooseLearned: boolean) {
  return KEY_LEARNED_CARDS;
  // this is not used as keyLookeAtCards is not used
  // return chooseLearned ? KEY_LEARNED_CARDS : KEY_LOOKED_AT_CARDS;
}
