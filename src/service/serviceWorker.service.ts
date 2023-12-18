import type { WOTD } from "../types/types";
import AppError from "../utils/error";

/**
 * Sends notification to service worker for WOTD notification
 * @param {WOTD} word Word of the day
 * @param {string} time Time to send notification
 * @returns {void}
 */
export function sendServiceWorkerWordOfTheDay(word: WOTD, time: string) {
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
