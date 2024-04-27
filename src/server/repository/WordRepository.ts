import type JsonImportWord from "../domain/client/jsonImportWord";
import type StrippedVocabularyWord from "../domain/client/strippedVocabularyWord";
import type VocabularyWord from "../domain/client/vocabularyWord";
import type LearnMode from "../domain/server/learnMode";

export interface WordRepository {
  getWords: () => Promise<VocabularyWord[]>;
  getWord: (word: string) => Promise<VocabularyWord>;
  getWordsByFilter: (filter: object) => Promise<VocabularyWord[]>;
  getCountByFilter: (filter: object) => Promise<number>;
  updateWord: (id: string, newWord: StrippedVocabularyWord) => Promise<string>;
  deleteWord: (id: string) => Promise<VocabularyWord>;
  addWord: (word: StrippedVocabularyWord) => Promise<string>;
  updateMode: (id: string, mode: LearnMode) => Promise<VocabularyWord>;
  importWords: (words: JsonImportWord[]) => Promise<number>;
}
