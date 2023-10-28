import { type FEWord, type VocabularyWord } from "../../types/types";

export interface WordRepository {
  getWords: () => Promise<VocabularyWord[]>;
  getWord: (word: string) => Promise<VocabularyWord>;
  getWordsByFilter: (word: string, filter: object) => Promise<VocabularyWord[]>;
  getCountByFilter: (filter: object) => Promise<number>;
  updateWord: (id: string, newWord: FEWord) => Promise<VocabularyWord>;
  deleteWord: (id: string) => Promise<VocabularyWord>;
  addWord: (word: FEWord) => Promise<VocabularyWord>;
  updateLearned: (id: string, learned: boolean) => Promise<VocabularyWord>;
}
