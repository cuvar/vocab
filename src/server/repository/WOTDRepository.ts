import { type VocabularyWord } from "../../types/types";

export interface WOTDRepository {
  getWords: () => Promise<VocabularyWord[]>;
}
