import {
  LearnMode as PrismaLearnMode,
  type Tag as PrismaTag,
  type Word as PrismaWord,
} from "@prisma/client";
import AppError from "../../lib/error/error";
import { addIcons } from "../../lib/helper";
import { db } from "../db";
import {
  jsonImportWordToWord,
  type JsonImportWord,
} from "../domain/client/jsonImportWord";
import { type StrippedVocabularyWord } from "../domain/client/strippedVocabularyWord";
import { type VocabularyWord } from "../domain/client/vocabularyWord";
import Tag from "../domain/server/tag";
import { TagSupabaseRepository } from "./TagSupabaseRepository";
import { type WordRepository } from "./WordRepository";
const tagRepo = new TagSupabaseRepository();

export class WordSupabaseRepository implements WordRepository {
  getWords = async () => {
    try {
      const data = await db.word.findMany({
        include: {
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  collectionId: true,
                },
              },
            },
          },
        },
      });
      const transformed = data.map((e) => {
        return toVocabularyWord(
          e.tags.map((t) => t.tag),
          e
        );
      });

      return transformed;
    } catch (error) {
      throw new AppError("Cannot get words", error);
    }
  };

  getWordsForCollection = async (collectionId: string) => {
    try {
      const data = await db.word.findMany({
        where: {
          collectionId: collectionId,
        },
        include: {
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  collectionId: true,
                },
              },
            },
          },
        },
      });

      const transformed = data.map((e) => {
        return toVocabularyWord(
          e.tags.map((t) => t.tag),
          e
        );
      });

      return transformed;
    } catch (error) {
      throw new AppError("Cannot get words", error);
    }
  };

  getWord = async (word: string) => {
    try {
      const data = await db.word.findUnique({
        where: {
          front: word,
        },
        include: {
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  collectionId: true,
                },
              },
            },
          },
        },
      });

      if (data == null) {
        throw new AppError("Word not found");
      }

      return toVocabularyWord(
        data.tags.map((t) => t.tag),
        data
      );
    } catch (error) {
      throw new AppError("Cannot get word " + word, error);
    }
  };

  getWordsByFilter = async (filter: object) => {
    try {
      const filtered = await db.word.findMany({
        where: {
          ...filter,
        },
        include: {
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  collectionId: true,
                },
              },
            },
          },
        },
      });

      if (filtered == null) {
        throw new AppError("Word not found");
      }

      const transformed = filtered.map((e) => {
        return toVocabularyWord(
          e.tags.map((t) => t.tag),
          e
        );
      });
      return transformed satisfies VocabularyWord[];
    } catch (error) {
      throw new AppError("Cannot get words by filter", error);
    }
  };

  getCountByFilter = async (filter: object) => {
    try {
      const count = await db.word.count({
        where: {
          ...filter,
        },
      });
      return count;
    } catch (error) {
      throw new AppError("Cannot count words", error);
    }
  };

  updateWord = async (wordId: string, newWord: StrippedVocabularyWord) => {
    try {
      const res = await db.word.update({
        where: {
          id: wordId,
        },
        data: {
          front: newWord.front,
          back: newWord.back,
          notes: newWord.notes,
          mode: newWord.mode,
          collectionId: newWord.collectionId,
        },
        include: {
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  collectionId: true,
                },
              },
            },
          },
        },
      });

      await tagRepo.setTagsForWord(
        wordId,
        newWord.tags.map((t) => t.id)
      );
      return res.front;
    } catch (error) {
      throw new AppError("Cannot update word with id " + wordId, error);
    }
  };

  deleteWord = async (id: string) => {
    try {
      const res = await db.word.delete({
        where: {
          id: id,
        },
        include: {
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  collectionId: true,
                },
              },
            },
          },
        },
      });

      return toVocabularyWord(
        res.tags.map((t) => t.tag),
        res
      );
    } catch (error) {
      throw new AppError("Cannot delete word with id " + id, error);
    }
  };

  addWord = async (word: StrippedVocabularyWord) => {
    if (word.front === "" || word.back === "") {
      throw new AppError("Word cannot be empty");
    }
    if (word.front.length > 100 || word.back.length > 100) {
      throw new AppError("Word too long");
    }
    try {
      const res = await db.word.create({
        data: {
          front: word.front,
          back: word.back,
          notes: word.notes,
          collectionId: word.collectionId,
          mode: PrismaLearnMode.UNLEARNED,
        },
        include: {
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  collectionId: true,
                },
              },
            },
          },
        },
      });

      await tagRepo.setTagsForWord(
        res.id,
        word.tags.map((t) => t.id)
      );
      return res.front;
    } catch (error) {
      throw new AppError("Cannot add word", error);
    }
  };

  updateMode = async (id: string, mode: PrismaLearnMode) => {
    try {
      const word = await db.word.findUnique({
        where: {
          id: id,
        },
      });

      if (!word) {
        throw new AppError("Word not found");
      }

      const res = await db.word.update({
        where: {
          front: word.front,
        },
        data: {
          mode: mode,
        },
        include: {
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  collectionId: true,
                },
              },
            },
          },
        },
      });

      return toVocabularyWord(
        res.tags.map((t) => t.tag),
        res
      );
    } catch (error) {
      throw new AppError("Cannot update mode for word with id " + id, error);
    }
  };

  importWords = async (words: JsonImportWord[]) => {
    try {
      const transformed = words.map((w) => jsonImportWordToWord(w).toPrisma());
      const data = await db.word.createMany({
        data: transformed,
        skipDuplicates: true,
      });

      return data.count;
    } catch (error) {
      throw new AppError("Cannot import words", error);
    }
  };
}

/**
 *
 * @param ptags
 * @param word
 */
function toVocabularyWord(ptags: PrismaTag[], word: PrismaWord) {
  const tags = ptags.map((t) => Tag.fromPrisma(t));
  const withIcons = addIcons(word);
  return {
    id: withIcons.id,
    front: withIcons.front,
    back: withIcons.back,
    notes: withIcons.notes,
    mode: withIcons.mode,
    collectionId: withIcons.collectionId,
    iconFront: withIcons.iconFront,
    iconBack: withIcons.iconBack,
    tags: tags,
  } satisfies VocabularyWord;
}
