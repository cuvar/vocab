import type LearnMode from "./learnMode";
import type Tag from "./tag";
import type VocabularyWord from "./vocabularyWord";

export default class ListElement implements VocabularyWord {
  id: string;
  translation: string;
  native: string;
  notes: string;
  mode: LearnMode;
  iconTranslation: string;
  iconNative: string;
  tags: Tag[];
  word: string;
  otherWord: string;

  constructor(
    id: string,
    translation: string,
    native: string,
    notes: string,
    mode: LearnMode,
    iconTranslation: string,
    iconNative: string,
    tags: Tag[],
    word: string,
    otherWord: string
  ) {
    this.id = id;
    this.translation = translation;
    this.native = native;
    this.notes = notes;
    this.mode = mode;
    this.iconTranslation = iconTranslation;
    this.iconNative = iconNative;
    this.tags = tags;
    this.word = word;
    this.otherWord = otherWord;
  }
}
