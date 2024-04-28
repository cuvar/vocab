import { type LearnMode as PrismaLearnMode } from "@prisma/client";
import { type JsonImportWord } from "../domain/client/jsonImportWord";
import { type StrippedVocabularyWord } from "../domain/client/strippedVocabularyWord";
import { type VocabularyWordData } from "../domain/client/vocabularyWord";

export interface WordRepository {
  getWords: () => Promise<VocabularyWordData[]>;
  getWord: (word: string) => Promise<VocabularyWordData>;
  getWordsByFilter: (filter: object) => Promise<VocabularyWordData[]>;
  getCountByFilter: (filter: object) => Promise<number>;
  updateWord: (id: string, newWord: StrippedVocabularyWord) => Promise<string>;
  deleteWord: (id: string) => Promise<VocabularyWordData>;
  addWord: (word: StrippedVocabularyWord) => Promise<string>;
  updateMode: (
    id: string,
    mode: PrismaLearnMode
  ) => Promise<VocabularyWordData>;
  importWords: (words: JsonImportWord[]) => Promise<number>;
}
