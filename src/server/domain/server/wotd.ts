import type prisma from "@prisma/client";
import { isDate, isObject, isString } from "~/lib/guards/base";
import VocabularyWord from "../client/vocabularyWord";

export default class Wotd implements prisma.Wotd {
  id: string;
  wordId: string;
  date: Date;

  constructor(id: string, wordId: string, date: Date) {
    this.id = id;
    this.wordId = wordId;
    this.date = date;
  }

  static fromPrisma(wotd: prisma.Wotd): Wotd {
    return new Wotd(wotd.id, wotd.wordId, wotd.date);
  }

  toPrisma(): prisma.Wotd {
    return {
      id: this.id,
      wordId: this.wordId,
      date: this.date,
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
    if (!VocabularyWord.validate(data.word)) {
      return false;
    }
    return true;
  }
}
