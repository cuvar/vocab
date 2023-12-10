import type { Settings } from "../../types/types";

/**
 * Checks whether data is of type Settings
 * @param {unknown} data Unkown type to be checked
 * @returns {boolean} Whether data is of type Date
 */
export function isVocabSettings(data: unknown): data is Settings {
  return data instanceof Date;
}
