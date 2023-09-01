declare interface VocabularyWord {
  id: string;
  translation: string;
  native: string;
  notes: string;
  c1business: boolean;
  learned: boolean;
  iconTranslation: string;
  iconNative: string;
}

declare type ListElement = VocabularyWord & {
  key: string;
  word: string;
  otherWord: string;
};

type ToastType = "success" | "error";
