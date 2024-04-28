import type { Word } from "@prisma/client";
import { env } from "../env/client.mjs";
import ListElement from "../server/domain/client/listElement";
import type VocabularyWord from "../server/domain/client/vocabularyWord";
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
  return new ListElement(
    word.id,
    word.translation,
    word.native,
    word.notes,
    word.mode,
    word.iconTranslation,
    word.iconNative,
    word.tags,
    word.translation,
    word.native
  );
}