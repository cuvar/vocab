import type { NotificationData, Settings } from "../types";
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

  if (!("reminderTime" in data) || typeof data.reminderTime !== "string") {
    return false;
  }

  return true;
}

/**
 * Checks whether data is of type NotificationData
 * @param {unknown} data Unkown type to be checked
 * @returns {boolean} Whether data is of type NotificationData
 */
export function isNotificationData(data: unknown): data is NotificationData {
  if (typeof data !== "object") return false;
  if (!data) return false;
  if (!("title" in data)) return false;
  if (typeof data.title !== "string") return false;
  if (!("message" in data)) return false;
  if (typeof data.message !== "string") return false;
  return true;
}
