import type LearnMode from "./learnMode";
import Word from "./word";

export default class JsonImportWord {
  translation: string;
  native: string;
  notes: string;
  mode: LearnMode;
  iconNative: string;
  iconTranslation: string;

  constructor(
    translation: string,
    native: string,
    notes: string,
    mode: LearnMode,
    iconNative: string,
    iconTranslation: string
  ) {
    this.translation = translation;
    this.native = native;
    this.notes = notes;
    this.mode = mode;
    this.iconNative = iconNative;
    this.iconTranslation = iconTranslation;
  }

  toWord(): Word {
    return new Word(
      "",
      this.translation,
      this.native,
      this.notes,
      this.mode.toPrisma()
    );
  }
}
