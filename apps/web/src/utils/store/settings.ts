import { parseSettings } from "../../../../server/src/service/parseCache.service";
import type { Settings } from "../../types/types";
import { KEY_SETTINGS } from "./keys";

/**
 * Sets the settings in the localStorage
 * @param {Settings} settings The settings that should be stored
 */
export function setSettings(settings: Settings) {
  localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
}

/**
 * Updates the settings in the localStorage
 * @param {Partial<Settings>} newValues New values that should be updated
 */
export function updateSettings(newValues: Partial<Settings>) {
  const currentSettings = getSettings();
  const newSettings = {
    ...currentSettings,
    ...newValues,
  };
  localStorage.setItem(KEY_SETTINGS, JSON.stringify(newSettings));
}

/**
 * Returns the learned words
 * @returns {Settings[]} The settings for the app
 */
export function getSettings(): Settings | null {
  const res = localStorage.getItem(KEY_SETTINGS);
  if (!res) {
    return null;
  }

  return parseSettings(res);
}
