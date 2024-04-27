import type VocabularyWord from "./vocabularyWord";

export default class FEWOTD {
  id: string;
  word: VocabularyWord;
  date: Date;

  constructor(id: string, word: VocabularyWord, date: Date) {
    this.id = id;
    this.word = word;
    this.date = date;
  }
}
