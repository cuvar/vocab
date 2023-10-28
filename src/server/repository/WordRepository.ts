export interface WordRepository {
  getWords: () => Promise<VocabularyWord[]>;
  getWord: (word: string) => Promise<VocabularyWord>;
  getWordsByFilter: (word: string, filter: any) => Promise<VocabularyWord[]>;
  getCountByFilter: (filter: any) => Promise<number>;
  updateWord: (id: string, newWord: FEWord) => void;
  deleteWord: (id: string) => void;
  addWord: (word: FEWord) => void;
  updateLearned: (id: string, learned: boolean) => void;
}
