import AppError from "~/lib/error/error";
import type Wotd from "../../domain/server/wotd";

/**
 * Sends notification to service worker for WOTD notification
 * @param {WOTD} word Word of the day
 * @param {string} time Time to send notification
 * @returns {void}
 */
export function sendServiceWorkerWordOfTheDay(word: Wotd, time: string) {
  if (typeof window === "undefined") {
    throw new AppError("Window not defined");
  }
  if (!window.navigator.serviceWorker) {
    throw new AppError("Service worker not supported");
  }
  if (!window.navigator.serviceWorker.controller) {
    throw new AppError("Service worker not active");
  }

  const message = {
    word: word,
    time: time,
  };
  window.navigator.serviceWorker.controller.postMessage({
    command: "wotd",
    message,
  });
}

/**
 * Sends notification to service worker for reminder time
 * @param {string} time Time to send notification
 * @returns {void}
 */
export function sendServiceWorkerReminderTime(time: string) {
  if (typeof window === "undefined") {
    throw new AppError("Window not defined");
  }
  if (!window.navigator.serviceWorker) {
    throw new AppError("Service worker not supported");
  }
  if (!window.navigator.serviceWorker.controller) {
    throw new AppError("Service worker not active");
  }

  const message = {
    time: time,
  };
  window.navigator.serviceWorker.controller.postMessage({
    command: "reminderTime",
    message,
  });
}
