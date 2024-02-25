/* eslint-disable jsdoc/require-jsdoc */
import type { ListElement, Settings } from "../../../web/src/types/types";
import { isVocabSettings } from "../../../web/src/utils/guards/other";
import { isListElement } from "../../../web/src/utils/guards/words";

export function parseListElements(input: string): ListElement[] {
  const parsed = JSON.parse(input) as unknown;
  if (!Array.isArray(parsed)) {
    return [];
  }
  const validOutput = parsed.every((item) => {
    isListElement(item);
  });

  if (!validOutput) {
    return [];
  }
  return parsed as ListElement[];
}

export function parseSettings(input: string): Settings | null {
  const parsed = JSON.parse(input) as unknown;
  if (!isVocabSettings(parsed)) {
    return null;
  }

  return parsed;
}
