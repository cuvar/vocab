import { type FEWotd } from "../domain/client/feWotd";
import type Word from "../domain/server/word";

export interface WOTDRepository {
  getToday: () => Promise<FEWotd | null>;
  getLastWords: (limit: number) => Promise<FEWotd[]>;
  add: (word: Word, date: Date) => Promise<FEWotd>;
}
