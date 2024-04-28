// https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification

import { type FEWotd } from "../../server/domain/client/feWotd";

/**
 * Sends a notification with the word of the day
 * @param {WOTD} wotd Word of the day object
 * @returns {{title: string, body: string}} Notification title and body
 */
export function getWotdNotificationData(wotd: FEWotd) {
  const notificationTitle = `WOTD: ${wotd.word.front}`;
  const notificationBody = `${wotd.word.back}`;
  return {
    title: notificationTitle,
    body: notificationBody,
  };
}

/**
 * Checks for Notification API support and permissions and sends a notification
 * @param {string} title Notification title
 * @param {string} body Notification body
 * @returns {undefined} Just for early returns
 */
export function sendNotification(title: string, body: string) {
  if (!("Notification" in window)) {
    throw new Error("This browser does not support desktop notification");
  }

  new Notification(title, {
    icon: "/apple-icon-60x60.png",
    body: body,
  });
}
