/* eslint-disable jsdoc/require-jsdoc */
import ListElement from "../../domain/client/listElement";
import Settings from "../../domain/client/settings";

export function parseListElements(input: string): ListElement[] {
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
  return parsed as ListElement[];
}

export function parseSettings(input: string): Settings | null {
  const parsed = JSON.parse(input) as unknown;
  if (!Settings.validate(parsed)) {
    return null;
  }

  return parsed;
}
