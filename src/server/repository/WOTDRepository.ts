import type FEWOTD from "../domain/client/feWotd";
import type Word from "../domain/server/word";

export interface WOTDRepository {
  getToday: () => Promise<FEWOTD | null>;
  getLastWords: (limit: number) => Promise<FEWOTD[]>;
  add: (word: Word, date: Date) => Promise<FEWOTD>;
}
