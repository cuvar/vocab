import { getWotdNotificationData } from "../service/notification.service";
import type { WOTD } from "../types/types";
import { isObject, isString } from "../utils/guards/base";
import { isWOTD } from "../utils/guards/words";

declare let self: ServiceWorkerGlobalScope;

// window.navigator.serviceWorker.controller.postMessage({command: 'log', message: 'hello world'})
self.addEventListener("message", async (event) => {
  if (!isObject(event)) return;
  if (!isObject(event.data)) return;
  if (!isString(event.data.command)) return;

  if (event.data.command === "log") {
    if (!("message" in event.data)) return;
    console.log(event?.data.message);
    return;
  }

  if (event.data.command === "wotd") {
    await sendWotdNotification(event.data);
    return;
  }

  console.log("hello data world");
});

/**
 * Sends actual notification to user
 * @param {object} data Data from message event
 */
async function sendWotdNotification(data: Record<string, string>) {
  if (!isObject(data.word)) return;
  console.log(data.word);
  if (!isWOTD(data.word)) return;

  const wotd = data.word as WOTD;
  const { title, body } = getWotdNotificationData(wotd);
  await self.registration.showNotification(title, {
    body: body,
    icon: "/apple-icon-60x60.png",
  });
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
//   console.log("service worker activated");
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

const REMINDER_TIME = "8:00";

setInterval(() => {
  const formated = formatTime(new Date());
  if (formated === REMINDER_TIME) {
    // TODO: send notification
  }
}, 59 * 1000);

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
