import { type Settings } from "~/server/domain/client/settings";

export const DEFAULT_SETTINGS: Settings = {
  randomizeCards: true,
  reminderTime: "9:00",
  sendWOTDNotifications: false,
};

export const AMOUNT_OF_WORDS_PER_PAGE = 10;
