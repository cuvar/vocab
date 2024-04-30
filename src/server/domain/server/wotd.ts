import type prisma from "@prisma/client";
import { isDate, isObject, isString } from "../../../lib/guards/base";
import { isVocabularyWord } from "../client/vocabularyWord";

export default class Wotd implements prisma.Wotd {
  id: string;
  wordId: string;
  date: Date;
  collectionId: string;

  constructor(id: string, wordId: string, date: Date, collectionId: string) {
    this.id = id;
    this.wordId = wordId;
    this.date = date;
    this.collectionId = collectionId;
  }

  static fromPrisma(wotd: prisma.Wotd): Wotd {
    return new Wotd(wotd.id, wotd.wordId, wotd.date, wotd.collectionId);
  }

  toPrisma(): prisma.Wotd {
    return {
      id: this.id,
      wordId: this.wordId,
      date: this.date,
      collectionId: this.collectionId,
    };
  }

  static validate(data: unknown): data is Wotd {
    if (!isObject(data)) {
      return false;
    }
    if (!isString(data.id)) {
      return false;
    }
    if (!isDate(data.date)) {
      return false;
    }
    if (!isString(data.collectionId)) {
      return false;
    }
    if (!isVocabularyWord(data.word)) {
      return false;
    }
    return true;
  }
}
