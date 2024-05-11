import type { Word } from "@prisma/client";
import { type ListElement } from "~/server/domain/client/listElement";
import { env } from "../env/client.mjs";
import { type VocabularyWord } from "../server/domain/client/vocabularyWord";
/**
 * Adds emoji icons to word object
 * @param {Word} word Word object
 * @returns {VocabularyWord} Word with icons
 */
export function addIcons(word: Word) {
  return {
    ...word,
    iconFront: env.NEXT_PUBLIC_FRONT_ICON,
    iconBack: env.NEXT_PUBLIC_BACK_ICON,
  };
}

/**
 * @param {VocabularyWord} word The word to transform
 * @returns {ListElement} The word to transform
 */
export function toListElement(word: VocabularyWord): ListElement {
  return {
    id: word.id,
    front: word.front,
    back: word.back,
    notes: word.notes,
    mode: word.mode,
    iconFront: word.iconFront,
    iconBack: word.iconBack,
    tags: word.tags,
    collectionId: word.collectionId,
    word: word.front,
    otherWord: word.back,
  } satisfies ListElement;
}
