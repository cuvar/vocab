import type { WOTD } from "../types/types";
import AppError from "../utils/error";

/**
 * Sends notification to service worker for WOTD notification
 * @param {WOTD} word Word of the day
 * @returns {void}
 */
export function sendServiceWorkerWordOfTheDay(word: WOTD) {
  if (typeof window === "undefined") {
    throw new AppError("Window not defined");
  }
  if (!window.navigator.serviceWorker) {
    throw new AppError("Service worker not supported");
  }
  if (!window.navigator.serviceWorker.controller) {
    throw new AppError("Service worker not active");
  }

  window.navigator.serviceWorker.controller.postMessage({
    command: "wotd",
    word,
  });
}
