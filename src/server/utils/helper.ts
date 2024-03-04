import type { Word } from "@prisma/client";
import { env } from "../../env/client.mjs";
import { VocabularyWord } from "../../types/types";
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
