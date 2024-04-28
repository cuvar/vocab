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
    iconNative: env.NEXT_PUBLIC_NATIVE_ICON,
    iconTranslation: env.NEXT_PUBLIC_TRANSLATION_ICON,
  };
}

/**
 * @param {VocabularyWord} word The word to transform
 * @returns {ListElement} The word to transform
 */
export function toListElement(word: VocabularyWord): ListElement {
  return {
    id: word.id,
    translation: word.translation,
    native: word.native,
    notes: word.notes,
    mode: word.mode,
    iconTranslation: word.iconTranslation,
    iconNative: word.iconNative,
    tags: word.tags,
    word: word.translation,
    otherWord: word.native,
  } satisfies ListElement;
}
