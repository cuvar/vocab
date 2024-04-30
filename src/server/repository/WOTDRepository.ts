import { type FEWotd } from "../domain/client/feWotd";
import type Word from "../domain/server/word";

export interface WOTDRepository {
  getToday: (collectionId: string) => Promise<FEWotd | null>;
  getLastWords: (limit: number, collectionId: string) => Promise<FEWotd[]>;
  add: (word: Word, date: Date) => Promise<FEWotd>;
}
