import { isBoolean, isObject, isString } from "../../../lib/guards/base";

export default class Settings {
  randomizeCards: boolean;
  reminderTime: string;
  sendWOTDNotifications: boolean;

  constructor(
    randomizeCards: boolean,
    reminderTime: string,
    sendWOTDNotifications: boolean
  ) {
    this.randomizeCards = randomizeCards;
    this.reminderTime = reminderTime;
    this.sendWOTDNotifications = sendWOTDNotifications;
  }

  static validate(data: unknown): data is Settings {
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
