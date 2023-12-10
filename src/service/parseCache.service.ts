/* eslint-disable jsdoc/require-jsdoc */
import type { ListElement } from "../types/types";
import { isListElement } from "../utils/guards/words";

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
