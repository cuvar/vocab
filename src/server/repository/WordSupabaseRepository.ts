import { LearnMode } from "@prisma/client";
import AppError from "../../lib/error/error";
import { addIcons } from "../../lib/helper";
import {
  type JsonImportWord,
  type SimpleWordInput,
  type Tag,
  type VocabularyWord,
} from "../../types/types";
import { prisma } from "../db";
import { TagSupabaseRepository } from "./TagSupabaseRepository";
import { type WordRepository } from "./WordRepository";
const tagRepo = new TagSupabaseRepository();

export class WordSupabaseRepository implements WordRepository {
  getWords = async () => {
    try {
      const data = await prisma.word.findMany({
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
        const tags = e.tags.map((t) => {
          return {
            id: t.tag.id,
            name: t.tag.name,
            description: t.tag.description,
          } satisfies Tag;
        });
        const withIcons = addIcons(e);
        return { ...withIcons, tags: tags } satisfies VocabularyWord;
      });
      return transformed satisfies VocabularyWord[];
    } catch (error) {
      throw error;
    }
  };

  getWord = async (word: string) => {
    const data = await prisma.word.findUnique({
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

    const tags = data.tags.map((t) => {
      return {
        id: t.tag.id,
        name: t.tag.name,
        description: t.tag.description,
      } satisfies Tag;
    });
    const withIcons = addIcons(data);
    return { ...withIcons, tags: tags } satisfies VocabularyWord;
  };

  getWordsByFilter = async (filter: object) => {
    const filtered = await prisma.word.findMany({
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
      const tags = e.tags.map((t) => {
        return {
          id: t.tag.id,
          name: t.tag.name,
          description: t.tag.description,
        } satisfies Tag;
      });
      const withIcons = addIcons(e);
      return { ...withIcons, tags: tags } satisfies VocabularyWord;
    });
    return transformed satisfies VocabularyWord[];
  };

  getCountByFilter = async (filter: object) => {
    const count = await prisma.word.count({
      where: {
        ...filter,
      },
    });
    return count;
  };

  updateWord = async (wordId: string, newWord: SimpleWordInput) => {
    try {
      const res = await prisma.word.update({
        where: {
          id: wordId,
        },
        data: {
          translation: newWord.translation,
          native: newWord.native,
          notes: newWord.notes,
          mode: newWord.mode,
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

      await tagRepo.setTagsForWord(wordId, newWord.tagIds);
      return res.translation;
    } catch (error) {
      throw error;
    }
  };

  deleteWord = async (id: string) => {
    try {
      const res = await prisma.word.delete({
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

      const tags = res.tags.map((t) => {
        return {
          id: t.tag.id,
          name: t.tag.name,
          description: t.tag.description,
        } satisfies Tag;
      });
      const withIcons = addIcons(res);
      return { ...withIcons, tags: tags } satisfies VocabularyWord;
    } catch (error) {
      throw error;
    }
  };

  addWord = async (word: SimpleWordInput) => {
    if (word.translation === "" || word.native === "") {
      throw new AppError("Word cannot be empty");
    }
    if (word.translation.length > 100 || word.native.length > 100) {
      throw new AppError("Word too long");
    }
    try {
      const res = await prisma.word.create({
        data: {
          translation: word.translation,
          native: word.native,
          notes: word.notes,
          mode: LearnMode.UNLEARNED,
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

      await tagRepo.setTagsForWord(res.id, word.tagIds);
      return res.translation;
    } catch (error) {
      throw error;
    }
  };

  updateMode = async (id: string, mode: LearnMode) => {
    try {
      const word = await prisma.word.findUnique({
        where: {
          id: id,
        },
      });

      if (!word) {
        throw new AppError("Word not found");
      }

      const res = await prisma.word.update({
        where: {
          translation: word.translation,
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
                },
              },
            },
          },
        },
      });

      const tags = res.tags.map((t) => {
        return {
          id: t.tag.id,
          name: t.tag.name,
          description: t.tag.description,
        } satisfies Tag;
      });
      const withIcons = addIcons(res);
      return { ...withIcons, tags: tags } satisfies VocabularyWord;
    } catch (error) {
      throw error;
    }
  };

  importWords = async (words: JsonImportWord[]) => {
    try {
      const transformed = words.map((w) => {
        return {
          native: w.native,
          translation: w.translation,
          mode: w.mode,
          notes: w.notes,
        };
      });
      const data = await prisma.word.createMany({
        data: transformed,
        skipDuplicates: true,
      });

      return data.count;
    } catch (error) {
      throw error;
    }
  };
}
