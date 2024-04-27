import {
  LearnMode as PrismaLearnMode,
  type Tag as PrismaTag,
  type Word as PrismaWord,
} from "@prisma/client";
import AppError from "~/lib/error/error";
import { addIcons } from "~/lib/helper";
import { db } from "../db";
import type JsonImportWord from "../domain/client/jsonImportWord";
import type StrippedVocabularyWord from "../domain/client/strippedVocabularyWord";
import VocabularyWord from "../domain/client/vocabularyWord";
import LearnMode from "../domain/server/learnMode";
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
      throw error;
    }
  };

  getWord = async (word: string) => {
    const data = await db.word.findUnique({
      where: {
        translation: word,
      },
      include: {
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
                description: true,
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
  };

  getWordsByFilter = async (filter: object) => {
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
  };

  getCountByFilter = async (filter: object) => {
    const count = await db.word.count({
      where: {
        ...filter,
      },
    });
    return count;
  };

  updateWord = async (wordId: string, newWord: StrippedVocabularyWord) => {
    try {
      const res = await db.word.update({
        where: {
          id: wordId,
        },
        data: {
          translation: newWord.translation,
          native: newWord.native,
          notes: newWord.notes,
          mode: newWord.mode.toPrisma(),
        },
        include: {
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  description: true,
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
      return res.translation;
    } catch (error) {
      throw error;
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
      throw error;
    }
  };

  addWord = async (word: StrippedVocabularyWord) => {
    if (word.translation === "" || word.native === "") {
      throw new AppError("Word cannot be empty");
    }
    if (word.translation.length > 100 || word.native.length > 100) {
      throw new AppError("Word too long");
    }
    try {
      const res = await db.word.create({
        data: {
          translation: word.translation,
          native: word.native,
          notes: word.notes,
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
      return res.translation;
    } catch (error) {
      throw error;
    }
  };

  updateMode = async (id: string, mode: LearnMode) => {
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
          translation: word.translation,
        },
        data: {
          mode: mode.toPrisma(),
        },
        include: {
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  description: true,
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
      throw error;
    }
  };

  importWords = async (words: JsonImportWord[]) => {
    try {
      const transformed = words.map((w) => w.toWord().toPrisma());
      const data = await db.word.createMany({
        data: transformed,
        skipDuplicates: true,
      });

      return data.count;
    } catch (error) {
      throw error;
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
  return new VocabularyWord(
    withIcons.id,
    withIcons.translation,
    withIcons.native,
    withIcons.notes,
    LearnMode.fromPrisma(withIcons.mode),
    withIcons.iconTranslation,
    withIcons.iconNative,
    tags
  );
}
