export type VocabularyWord = {
  id: string;
  translation: string;
  native: string;
  notes: string;
  learned: boolean;
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
  "translation" | "native" | "notes" | "learned"
> & { tagIds: string[] };
export type VocabularyFlashCard = VocabularyWord & {
  mode: FlashCardMode;
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
  learned: boolean;
  iconNative: string;
  iconTranslation: string;
};
