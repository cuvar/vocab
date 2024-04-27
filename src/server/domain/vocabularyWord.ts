import type LearnMode from "./learnMode";
import type Tag from "./tag";

export default class VocabularyWord {
  id: string;
  translation: string;
  native: string;
  notes: string;
  mode: LearnMode;
  iconTranslation: string;
  iconNative: string;
  tags: Tag[];

  constructor(
    id: string,
    translation: string,
    native: string,
    notes: string,
    mode: LearnMode,
    iconTranslation: string,
    iconNative: string,
    tags: Tag[]
  ) {
    this.id = id;
    this.translation = translation;
    this.native = native;
    this.notes = notes;
    this.mode = mode;
    this.iconTranslation = iconTranslation;
    this.iconNative = iconNative;
    this.tags = tags;
  }
}
