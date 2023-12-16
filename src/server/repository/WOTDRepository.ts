import type { Word } from "@prisma/client";
import type { WOTD } from "../../types/types";

export interface WOTDRepository {
  getLastWords: (limit: number) => Promise<WOTD[]>;
  add: (word: Word, date: Date) => Promise<void>;
}
