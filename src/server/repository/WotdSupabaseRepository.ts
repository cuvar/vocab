import type { Word } from "@prisma/client";
import { type Tag, type VocabularyWord, type WOTD } from "../../types/types";
import { addIcons } from "../../utils/helper";
import { prisma } from "../db";
import { type WOTDRepository } from "./WOTDRepository";

export class WOTDSupabaseRepository implements WOTDRepository {
  getToday = async () => {
    try {
      const data = await prisma.wotd.findUnique({
        where: {
          date: new Date().toISOString(),
        },
        include: {
          word: {
            select: {
              id: true,
              mode: true,
              native: true,
              notes: true,
              translation: true,
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
          },
        },
      });

      if (!data) return null;

      const withIcons = addIcons(data.word);
      const tags = data.word.tags.map((t) => {
        return {
          id: t.tag.id,
          name: t.tag.name,
          description: t.tag.description,
        } satisfies Tag;
      });

      const word = { ...withIcons, tags: tags } satisfies VocabularyWord;
      const transformed = {
        id: data.id,
        word: word satisfies VocabularyWord,
        date: data.date,
      };
      return transformed satisfies WOTD as WOTD;
    } catch (error) {
      throw error;
    }
  };
  getLastWords = async (limit: number) => {
    try {
      const data = await prisma.wotd.findMany({
        take: limit,
        include: {
          word: {
            select: {
              id: true,
              mode: true,
              native: true,
              notes: true,
              translation: true,
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
          },
        },
      });

      const transformed = data.map((e) => {
        const withIcons = addIcons(e.word);
        const tags = e.word.tags.map((t) => {
          return {
            id: t.tag.id,
            name: t.tag.name,
            description: t.tag.description,
          } satisfies Tag;
        });

        const word = { ...withIcons, tags: tags } satisfies VocabularyWord;
        return {
          id: e.id,
          word: word satisfies VocabularyWord,
          date: e.date,
        };
      });
      return transformed satisfies WOTD[] as WOTD[];
    } catch (error) {
      throw error;
    }
  };

  add = async (word: Word, date: Date) => {
    try {
      const data = await prisma.wotd.create({
        data: {
          word: {
            connect: {
              id: word.id,
            },
          },
          date: date,
        },
        include: {
          word: {
            select: {
              id: true,
              mode: true,
              native: true,
              notes: true,
              translation: true,
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
          },
        },
      });

      const withIcons = addIcons(data.word);
      const tags = data.word.tags.map((t) => {
        return {
          id: t.tag.id,
          name: t.tag.name,
          description: t.tag.description,
        } satisfies Tag;
      });

      const addedWord = { ...withIcons, tags: tags } satisfies VocabularyWord;
      const transformed = {
        id: data.id,
        word: addedWord satisfies VocabularyWord,
        date: data.date,
      };
      return transformed satisfies WOTD as WOTD;
    } catch (error) {
      throw error;
    }
  };
}
