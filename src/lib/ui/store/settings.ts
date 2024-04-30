import { DEFAULT_SETTINGS } from "~/lib/const";
import { type Settings } from "~/server/domain/client/settings";
import { parseSettings } from "../../../server/service/client/parseCache.service";
import { KEY_SETTINGS } from "./keys";

/**
 * Sets the settings in the localStorage
 * @param {Settings} settings The settings that should be stored
 * @param collectionId
 */
export function storeSettings(settings: Settings, collectionId: string) {
  localStorage.setItem(
    collectionId + "-" + KEY_SETTINGS,
    JSON.stringify(settings)
  );
}

/**
 * Updates the settings in the localStorage
 * @param {Partial<Settings>} newValues New values that should be updated
 * @param collectionId
 */
export function updateSettings(
  newValues: Partial<Settings>,
  collectionId: string
) {
  const currentSettings = getSettings(collectionId);
  const newSettings = {
    ...currentSettings,
    ...newValues,
  };
  localStorage.setItem(
    collectionId + "-" + KEY_SETTINGS,
    JSON.stringify(newSettings)
  );
}

/**
 * Returns the learned words
 * @param collectionId
 * @returns {Settings[]} The settings for the app
 */
export function getSettings(collectionId: string): Settings {
  const res = localStorage.getItem(collectionId + "-" + KEY_SETTINGS);
  if (!res) {
    return DEFAULT_SETTINGS;
  }

  return parseSettings(res) ?? DEFAULT_SETTINGS;
}
