import { type SimpleWordInput, type VocabularyWord } from "../../types/types";

export interface WordRepository {
  getWords: () => Promise<VocabularyWord[]>;
  getWord: (word: string) => Promise<VocabularyWord>;
  getWordsByFilter: (word: string, filter: object) => Promise<VocabularyWord[]>;
  getCountByFilter: (filter: object) => Promise<number>;
  updateWord: (id: string, newWord: SimpleWordInput) => Promise<string>;
  deleteWord: (id: string) => Promise<VocabularyWord>;
  addWord: (word: SimpleWordInput) => Promise<string>;
  updateLearned: (id: string, learned: boolean) => Promise<VocabularyWord>;
}
