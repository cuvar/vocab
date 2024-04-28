/* eslint-disable jsdoc/require-jsdoc */
import {
  isListElement,
  type ListElement,
} from "../../domain/client/listElement";
import Settings, { type SettingsData } from "../../domain/client/settings";

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

export function parseSettings(input: string): SettingsData | null {
  const parsed = JSON.parse(input) as unknown;
  if (!Settings.validate(parsed)) {
    return null;
  }

  return parsed;
}
