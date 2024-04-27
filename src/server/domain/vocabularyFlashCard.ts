import type LearnMode from "./learnMode";
import type Tag from "./tag";
import type VocabularyWord from "./vocabularyWord";

export type FlashCardMode = "good" | "bad" | "none";

export default class VocabularyFlashCard implements VocabularyWord {
  id: string;
  translation: string;
  native: string;
  notes: string;
  mode: LearnMode;
  iconTranslation: string;
  iconNative: string;
  tags: Tag[];
  cardMode: FlashCardMode;
  switched: boolean;

  constructor(
    id: string,
    translation: string,
    native: string,
    notes: string,
    mode: LearnMode,
    iconTranslation: string,
    iconNative: string,
    tags: Tag[],
    cardMode: FlashCardMode,
    switched: boolean
  ) {
    this.id = id;
    this.translation = translation;
    this.native = native;
    this.notes = notes;
    this.mode = mode;
    this.iconTranslation = iconTranslation;
    this.iconNative = iconNative;
    this.tags = tags;
    this.cardMode = cardMode;
    this.switched = switched;
  }
}
