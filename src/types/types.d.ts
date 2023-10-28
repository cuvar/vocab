export type VocabularyWord = {
  id: string;
  translation: string;
  native: string;
  notes: string;
  c1business: boolean;
  learned: boolean;
  iconTranslation: string;
  iconNative: string;
};

export type ListElement = VocabularyWord & {
  word: string;
  otherWord: string;
};

export type SimpleWordInput = Pick<
  VocabularyWord,
  "translation" | "native" | "notes" | "c1business" | "learned"
>;
export type VocabularyFlashCard = VocabularyWord & { mode: FlashCardMode };

export type ToastType = "success" | "error";
export type FlashCardMode = "good" | "bad" | "none";
