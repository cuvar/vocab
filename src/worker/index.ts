import { isObject, isString } from "../lib/guards/base";
import { getWotdNotificationData } from "../lib/ui/notification";
import { isFEWotd, type FEWotd } from "../server/domain/client/feWotd";

declare let self: ServiceWorkerGlobalScope;

// window.navigator.serviceWorker.controller.postMessage({command: 'log', message: 'hello world'})
let LAST_WOTD: FEWotd | null = null;
let CURRENT_WOTD: FEWotd | null = null;
let REMINDER_TIME = "";

self.addEventListener("message", (event) => {
  if (!isObject(event)) return;
  if (!isObject(event.data)) return;
  if (!isString(event.data.command)) return;

  if (event.data.command === "log") {
    if (!("message" in event.data)) return;
    console.log(event?.data.message);
    return;
  }

  if (event.data.command === "wotd") {
    if (!isObject(event.data.message)) return;
    updateWOTD(event.data.message.word);
    updateReminderTime(event.data.message.time);
    return;
  }

  if (event.data.command === "reminderTime") {
    if (!isObject(event.data.message)) return;
    updateReminderTime(event.data.message.time);
    if (!CURRENT_WOTD) {
      void (async () => await fetchWOTD())();
    }
    return;
  }
});

setInterval(() => {
  const formated = formatTime(new Date());
  if (formated !== REMINDER_TIME) {
    return;
  }
  try {
    void (async () => await fetchWOTD())();
    if (!CURRENT_WOTD || CURRENT_WOTD == LAST_WOTD) return;
    void (async () => await sendWotdNotification(CURRENT_WOTD))();
    LAST_WOTD = CURRENT_WOTD;
  } catch (error) {
    console.error("Could not send notification due to following error.", error);
  }
}, 60 * 1000);

/**
 * Fetches the wotd from the api
 */
async function fetchWOTD() {
  try {
    const res = await fetch("/api/workers/wotd");
    const json = (await res.json()) as unknown;
    if (!isObject(json)) return;
    if (!("wotd" in json) || !isString(json.wotd)) return;
    const newWotd = JSON.parse(json.wotd) as FEWotd;
    newWotd.date = new Date(newWotd.date);
    updateWOTD(newWotd);
  } catch (error) {
    console.error("fetchWOTD:", error);
    throw error;
  }
}

/**
 * Updates file-gobal wotd variable
 * @param {object} word Data from message event
 */
function updateWOTD(word: unknown) {
  if (!isFEWotd(word)) return;
  CURRENT_WOTD = word as FEWotd;
  console.log("updated wotd");
}

/**
 * Updates file-gobal reminder time variable
 * @param {object} time Data from message event
 */
function updateReminderTime(time: unknown) {
  if (!isString(time)) return;
  REMINDER_TIME = time;
  console.log("updated time");
}

/**
 * Sends actual notification to user
 * @param {WOTD} wotd Data from message event
 */
async function sendWotdNotification(wotd: FEWotd) {
  if (!Notification) {
    throw new Error("This browser does not support desktop notification");
  }

  if (Notification.permission !== "granted") {
    throw new Error("Permission not granted");
  }

  const { title, body } = getWotdNotificationData(wotd);
  await self.registration.showNotification(title, {
    body: body,
    icon: "/apple-icon-60x60.png",
  });
}

/**
 * Formats hours and minutes to HH:MM string
 * @param {Date} date Date to format
 * @returns {string} HH:MM string
 */
function formatTime(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const hoursString = hours.toString().padStart(2, "0");
  const minutesString = minutes.toString().padStart(2, "0");
  return `${hoursString}:${minutesString}`;
}
// self.addEventListener('fetch', event => {
//   // Intercept fetch requests and respond with cached resources if available
//   event.respondWith(
//     caches.match(event.request).then(response => {
//       return response || fetch(event.request);
//     })
//   );
// });

// self.addEventListener('install', event => {
//   // Perform installation tasks here
//   event.waitUntil(
//     // Perform any caching or other tasks needed during installation
//     caches.open('my-cache').then(cache => {
//       return cache.addAll([
//         '/',
//         '/index.html',
//         '/styles.css',
//         '/script.js',
//         // Add other files to cache as needed
//       ]);
//     })
//   );
// });

// self.addEventListener("activate", () => {
//   console.log"service worker activated");
// });

// self.addEventListener("push", (event) => {
//   const data: unknown = JSON.parse(event?.data.text() ?? "{}");
//   if (!isNotificationData(data)) return;
//   data;
//   event?.waitUntil(
//     self.registration.showNotification(data.title, {
//       body: data.message,
//       icon: "/apple-icon-60x60.png",
//     })
//   );
// });

// self.addEventListener("notificationclick", (event) => {
//   event?.notification.close();
//   event?.waitUntil(
//     self.clients
//       .matchAll({ type: "window", includeUncontrolled: true })
//       .then(function (clientList) {
//         if (clientList.length > 0) {
//           let client = clientList[0]!;
//           for (const cItem of clientList) {
//             if (cItem.focused) {
//               client = cItem;
//             }
//           }
//           return client.focus();
//         }
//         return self.clients.openWindow("/wotd");
//       })
//   );
// });
