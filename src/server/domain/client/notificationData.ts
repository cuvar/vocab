import { isObject, isString } from "../../../lib/guards/base";

export default class NotificationData {
  title: string;
  message: string;

  constructor(title: string, message: string) {
    this.title = title;
    this.message = message;
  }

  static validate(data: unknown): data is NotificationData {
    if (!isObject(data)) {
      return false;
    }

    if (!isString(data.title)) {
      return false;
    }

    if (!isString(data.message)) {
      return false;
    }
    return true;
  }
}
