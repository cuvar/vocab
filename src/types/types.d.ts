declare interface VocabularyWord {
  english: string;
  german: string;
  c1business: boolean;
  notes: string;
  learned: boolean;
}

declare type ListElement = VocabularyWord & {
  key: string;
  word: string;
  translation: string;
};
