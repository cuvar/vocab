import type prisma from "@prisma/client";

export default class Word implements prisma.Word {
  id: string;
  translation: string;
  native: string;
  notes: string;
  mode: prisma.LearnMode;

  constructor(
    id: string,
    translation: string,
    native: string,
    notes: string,
    mode: prisma.LearnMode
  ) {
    this.id = id;
    this.translation = translation;
    this.native = native;
    this.notes = notes;
    this.mode = mode;
  }

  static fromPrisma(word: prisma.Word): Word {
    return new Word(
      word.id,
      word.translation,
      word.native,
      word.notes,
      word.mode
    );
  }

  toPrisma(): prisma.Word {
    return {
      id: this.id,
      translation: this.translation,
      native: this.native,
      notes: this.notes,
      mode: this.mode,
    };
  }
}
