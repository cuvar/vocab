import { isBoolean, isObject, isString } from "../../../lib/guards/base";

export type Settings = {
  randomizeCards: boolean;
  reminderTime: string;
  sendWOTDNotifications: boolean;
  allowWOTD: boolean;
};

/**
 *
 * @param data
 */
export function isSettings(data: unknown): data is Settings {
  if (!isObject(data)) {
    return false;
  }

  if (!isBoolean(data.randomizeCards)) {
    return false;
  }

  if (!isString(data.reminderTime)) {
    return false;
  }

  if (!isBoolean(data.sendWOTDNotifications)) {
    return false;
  }

  if (!isBoolean(data.allowWOTD)) {
    return false;
  }

  return true;
}
