/* eslint-disable jsdoc/require-jsdoc */
import ListElement, {
  type ListElementData,
} from "../../domain/client/listElement";
import Settings, { type SettingsData } from "../../domain/client/settings";

export function parseListElements(input: string): ListElementData[] {
  const parsed = JSON.parse(input) as unknown;
  if (!Array.isArray(parsed)) {
    return [];
  }
  const validOutput = parsed.every((item) => {
    ListElement.validate(item);
  });

  if (!validOutput) {
    return [];
  }
  return parsed as ListElementData[];
}

export function parseSettings(input: string): SettingsData | null {
  const parsed = JSON.parse(input) as unknown;
  if (!Settings.validate(parsed)) {
    return null;
  }

  return parsed;
}
