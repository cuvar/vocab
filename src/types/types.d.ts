declare type VocabularyWord = {
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

declare type FEWord = Pick<VocabularyWord, "translation" | "native" | "notes" | "c1business" | "learned">

type ToastType = "success" | "error";

type FlashCardMode = "good" | "bad" | "none";

type VocabularyFlashCard = VocabularyWord & { mode: FlashCardMode };
