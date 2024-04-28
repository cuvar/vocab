import { isObject, isString } from "../../../lib/guards/base";

export type NotificationDataData = {
  title: string;
  message: string;
};

export default class NotificationData {
  static validate(data: unknown): data is NotificationDataData {
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
