import { isBoolean, isObject, isString } from "../../../lib/guards/base";

export type SettingsData = {
  randomizeCards: boolean;
  reminderTime: string;
  sendWOTDNotifications: boolean;
};

export default class Settings {
  static validate(data: unknown): data is SettingsData {
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
}
