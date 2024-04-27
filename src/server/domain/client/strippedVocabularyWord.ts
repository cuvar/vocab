import type LearnMode from "../server/learnMode";
import type Tag from "../server/tag";

export default class StrippedVocabularyWord {
  translation: string;
  native: string;
  notes: string;
  mode: LearnMode;
  tags: Tag[];

  constructor(
    translation: string,
    native: string,
    notes: string,
    mode: LearnMode,
    tags: Tag[]
  ) {
    this.translation = translation;
    this.native = native;
    this.notes = notes;
    this.mode = mode;
    this.tags = tags;
  }
}
