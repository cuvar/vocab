import { type Tag, type VocabularyWord } from "../../types/types";
import { addIcons } from "../../utils/helper";
import { prisma } from "../db";
import { type WOTDRepository } from "./WOTDRepository";

export class WOTDSupabaseRepository implements WOTDRepository {
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
      throw new Error("Word not found");
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
}
