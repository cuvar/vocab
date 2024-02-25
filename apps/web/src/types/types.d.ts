import { type LearnMode } from "@prisma/client";
export type VocabularyWord = {
  id: string;
  translation: string;
  native: string;
  notes: string;
  mode: LearnMode;
  iconTranslation: string;
  iconNative: string;
  tags: Tag[];
};

export type ListElement = VocabularyWord & {
  word: string;
  otherWord: string;
};

export type SimpleWordInput = Pick<
  VocabularyWord,
  "translation" | "native" | "notes" | "mode"
> & { tagIds: string[] };
export type VocabularyFlashCard = VocabularyWord & {
  cardMode: FlashCardMode;
  switched: boolean;
};

export type ToastType = "success" | "error";
export type FlashCardMode = "good" | "bad" | "none";

export type Tag = {
  id: string;
  name: string;
  description: string;
};

export type TagData = Tag & {
  checked: boolean;
};

export type JsonImportWord = {
  translation: string;
  native: string;
  notes: string;
  mode: LearnMode;
  iconNative: string;
  iconTranslation: string;
};

export type Settings = {
  randomizeCards: boolean;
  reminderTime: string;
  sendWOTDNotifications: boolean;
};

export type WOTD = {
  id: string;
  word: VocabularyWord;
  date: Date;
};

export type NotificationData = {
  title: string;
  message: string;
};
