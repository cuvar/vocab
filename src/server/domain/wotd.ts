import type prisma from "@prisma/client";

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
}
