import { isBoolean, isObject, isString } from "../../../lib/guards/base";

export type Settings = {
  randomizeCards: boolean;
  reminderTime: string;
  sendWOTDNotifications: boolean;
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

  return true;
}
