import { type LearnMode } from "@prisma/client";
import {
  type JsonImportWord,
  type SimpleWordInput,
  type VocabularyWord,
} from "../../../types/types";

export interface WordRepository {
  getWords: () => Promise<VocabularyWord[]>;
  getWord: (word: string) => Promise<VocabularyWord>;
  getWordsByFilter: (filter: object) => Promise<VocabularyWord[]>;
  getCountByFilter: (filter: object) => Promise<number>;
  updateWord: (id: string, newWord: SimpleWordInput) => Promise<string>;
  deleteWord: (id: string) => Promise<VocabularyWord>;
  addWord: (word: SimpleWordInput) => Promise<string>;
  updateMode: (id: string, mode: LearnMode) => Promise<VocabularyWord>;
  importWords: (words: JsonImportWord[]) => Promise<number>;
}
