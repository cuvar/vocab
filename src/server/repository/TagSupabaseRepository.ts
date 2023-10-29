import { type Tag } from "../../types/types";
import { prisma } from "../db";
import { type TagRepository } from "./TagRepository";

export class TagSupabaseRepository implements TagRepository {
  getTags = async () => {
    try {
      const data = await prisma.tag.findMany();
      const tags = data.map((e) => {
        return {
          id: e.id,
          name: e.name,
          description: e.description,
        } satisfies Tag;
      });
      return tags;
    } catch (error) {
      throw error;
    }
  };

  getTag = async (tagName: string) => {
    try {
      const data = await prisma.tag.findUnique({
        where: {
          name: tagName,
        },
      });

      if (!data) {
        throw new Error("Cannot find tag " + tagName);
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description,
      } satisfies Tag;
    } catch (error) {
      throw error;
    }
  };

  getTagsForWord = async (wordId: string) => {
    try {
      const data = await prisma.word.findUnique({
        where: {
          id: wordId,
        },
        select: {
          tags: {
            include: {
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

      if (!data) {
        throw new Error("Cannot find word with id " + wordId);
      }

      const tags = data.tags.map((t) => {
        return {
          id: t.tag.id,
          name: t.tag.name,
          description: t.tag.description,
        } satisfies Tag;
      });

      return tags;
    } catch (error) {
      throw error;
    }
  };

  setTagsForWord = async (wordId: string, tagIds: string[]) => {
    const createData = tagIds.map((t) => {
      return {
        tagId: t,
        wordId: wordId,
      };
    });

    try {
      await prisma.wordTags.deleteMany({
        where: {
          wordId: wordId,
        },
      });

      const createRes = await prisma.wordTags.createMany({
        data: createData,
      });

      if (!createRes) {
        throw new Error("Cannot set tags for word with id " + wordId);
      }

      return createRes.count;
    } catch (error) {
      throw error;
    }
  };

  updateTag = async (tagId: string, name: string, description: string) => {
    try {
      const data = await prisma.tag.update({
        where: {
          id: tagId,
        },
        data: {
          name: name,
          description: description,
        },
      });

      return {
        id: data.id,
        name: data.name,
        description: data.description,
      } satisfies Tag;
    } catch (error) {
      throw error;
    }
  };
}
