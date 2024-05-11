/* eslint-disable jsdoc/require-jsdoc */
import {
  isFECollection,
  type FECollection,
} from "~/server/domain/client/feCollection";
import {
  isListElement,
  type ListElement,
} from "../../domain/client/listElement";
import { isSettings, type Settings } from "../../domain/client/settings";

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
  if (!isSettings(parsed)) {
    return null;
  }

  return parsed;
}

export function parseCollections(input: string): FECollection[] {
  const parsed = JSON.parse(input) as unknown;
  if (!Array.isArray(parsed)) {
    return [];
  }
  const validOutput = parsed.every((item) => {
    return isFECollection(item);
  });

  if (!validOutput) {
    return [];
  }
  return parsed as FECollection[];
}
