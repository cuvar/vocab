import type prisma from "@prisma/client";

export default class WordTags implements prisma.WordTags {
  wordId: string;
  tagId: string;

  constructor(wordId: string, tagId: string) {
    this.wordId = wordId;
    this.tagId = tagId;
  }

  static fromPrisma(wordtags: prisma.WordTags): WordTags {
    return new WordTags(wordtags.wordId, wordtags.tagId);
  }

  toPrisma(): prisma.WordTags {
    return {
      wordId: this.wordId,
      tagId: this.tagId,
    };
  }
}
