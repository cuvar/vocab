import { isObject, isString } from "../../../lib/guards/base";

export type NotificationData = {
  title: string;
  message: string;
};

/**
 *
 * @param data
 */
export function isNotificationData(data: unknown): data is NotificationData {
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
