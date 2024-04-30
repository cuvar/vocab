import type prisma from "@prisma/client";

export default class Word implements prisma.Word {
  id: string;
  front: string;
  back: string;
  notes: string;
  mode: prisma.LearnMode;
  collectionId: string;

  constructor(
    id: string,
    front: string,
    back: string,
    notes: string,
    mode: prisma.LearnMode,
    collectionId: string
  ) {
    this.id = id;
    this.front = front;
    this.back = back;
    this.notes = notes;
    this.mode = mode;
    this.collectionId = collectionId;
  }

  static fromPrisma(word: prisma.Word): Word {
    return new Word(
      word.id,
      word.front,
      word.back,
      word.notes,
      word.mode,
      word.collectionId
    );
  }

  toPrisma(): prisma.Word {
    return {
      id: this.id,
      front: this.front,
      back: this.back,
      notes: this.notes,
      mode: this.mode,
      collectionId: this.collectionId,
    };
  }
}
