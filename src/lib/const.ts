import { type SettingsData } from "~/server/domain/client/settings";

export const DEFAULT_SETTINGS: SettingsData = {
  randomizeCards: true,
  reminderTime: "9:00",
  sendWOTDNotifications: false,
};

export const AMOUNT_OF_WORDS_PER_PAGE = 10;
