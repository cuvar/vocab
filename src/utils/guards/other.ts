import type { Settings } from "../../types/types";
import { isObject } from "./base";

/**
 * Checks whether data is of type Settings
 * @param {unknown} data Unkown type to be checked
 * @returns {boolean} Whether data is of type Date
 */
export function isVocabSettings(data: unknown): data is Settings {
  if (!isObject(data)) {
    return false;
  }

  if (!("randomizeCards" in data) || typeof data.randomizeCards !== "boolean") {
    return false;
  }

  return true;
}
