import { getWOTD } from "./wotd.service";

// https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification

export async function sendWOTDNotification() {
  try {
    const wotd = await getWOTD();
    const notificationTitle = `Word of the day: ${wotd.native} - ${wotd.translation}`;
    const notificationBody = `${wotd.native}`;
    await sendNotification(notificationTitle, notificationBody);
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

  const notification = new Notification(title, {
    icon: "/favicon.ico",
    body: body,
  });
}
