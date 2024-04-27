import { type Tag as PrismaTag, type Word as PrismaWord } from "@prisma/client";
import { addIcons } from "~/lib/helper";
import { db } from "../db";
import FEWOTD from "../domain/client/feWotd";
import VocabularyWord from "../domain/client/vocabularyWord";
import LearnMode from "../domain/server/learnMode";
import Tag from "../domain/server/tag";
import type Word from "../domain/server/word";
import { getTodayMorning } from "../service/getDate.service";
import { type WOTDRepository } from "./WOTDRepository";

export class WOTDSupabaseRepository implements WOTDRepository {
  getToday = async () => {
    try {
      const data = await db.wotd.findFirst({
        where: {
          date: {
            gte: getTodayMorning().toISOString(),
          },
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

      return toFEWOTD(
        data.word.tags.map((t) => t.tag),
        data.word,
        data
      );
    } catch (error) {
      throw error;
    }
  };
  getLastWords = async (limit: number) => {
    try {
      const data = await db.wotd.findMany({
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
        return toFEWOTD(
          e.word.tags.map((t) => t.tag),
          e.word,
          e
        );
      });

      return transformed;
    } catch (error) {
      throw error;
    }
  };

  add = async (word: Word, date: Date) => {
    try {
      const data = await db.wotd.create({
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

      return toFEWOTD(
        data.word.tags.map((t) => t.tag),
        word,
        data
      );
    } catch (error) {
      throw error;
    }
  };
}

/**
 *
 * @param tags
 * @param ptags
 * @param word
 * @param data
 * @param data.id
 * @param data.date
 */
function toFEWOTD(
  ptags: PrismaTag[],
  word: PrismaWord,
  data: { id: string; date: Date }
) {
  const tags = ptags.map((t) => Tag.fromPrisma(t));
  const withIcons = addIcons(word);
  const nword = new VocabularyWord(
    withIcons.id,
    withIcons.translation,
    withIcons.native,
    withIcons.notes,
    LearnMode.fromPrisma(withIcons.mode),
    withIcons.iconTranslation,
    withIcons.iconNative,
    tags
  );

  return new FEWOTD(data.id, nword, data.date);
}
