import type { Word } from "@prisma/client";

import type { WOTD } from "@vocab/validators";

export interface WOTDRepository {
  getToday: () => Promise<WOTD | null>;
  getLastWords: (limit: number) => Promise<WOTD[]>;
  add: (word: Word, date: Date) => Promise<WOTD>;
}
