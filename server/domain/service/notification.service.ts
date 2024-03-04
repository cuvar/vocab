import type { WOTD } from "../../../src/types/types";

// https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification

/**
 * Sends a notification with the word of the day
 * @param {WOTD} wotd Word of the day object
 * @returns {{title: string, body: string}} Notification title and body
 */
export function getWotdNotificationData(wotd: WOTD) {
  try {
    const notificationTitle = `WOTD: ${wotd.word.translation}`;
    const notificationBody = `${wotd.word.native}`;
    return {
      title: notificationTitle,
      body: notificationBody,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * Checks for Notification API support and permissions and sends a notification
 * @param {string} title Notification title
 * @param {string} body Notification body
 * @returns {undefined} Just for early returns
 */
export async function sendNotification(title: string, body: string) {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
    return;
  }
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return;
    }
  }

  new Notification(title, {
    icon: "/apple-icon-60x60.png",
    body: body,
  });
}
