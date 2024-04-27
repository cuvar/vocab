import AppError from "../../lib/error/error";
import { prisma } from "../db";
import Tag from "../domain/server/tag";
import { type TagRepository } from "./TagRepository";

export class TagSupabaseRepository implements TagRepository {
  getTags = async () => {
    try {
      const data = await prisma.tag.findMany();
      const tags = data.map((e) => Tag.fromPrisma(e));
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
        throw new AppError("Cannot find tag " + tagName);
      }

      return Tag.fromPrisma(data);
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
              tag: {},
            },
          },
        },
      });

      if (!data) {
        throw new AppError("Cannot find word with id " + wordId);
      }

      const tags = data.tags.map((e) => Tag.fromPrisma(e.tag));

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
        throw new AppError("Cannot set tags for word with id " + wordId);
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

      return Tag.fromPrisma(data);
    } catch (error) {
      throw error;
    }
  };

  addTag = async (name: string, description: string) => {
    try {
      const data = await prisma.tag.create({
        data: {
          name: name,
          description: description,
        },
      });

      return Tag.fromPrisma(data);
    } catch (error) {
      throw error;
    }
  };

  deleteTag = async (tagId: string) => {
    try {
      const data = await prisma.tag.delete({
        where: {
          id: tagId,
        },
      });

      return Tag.fromPrisma(data);
    } catch (error) {
      throw error;
    }
  };
}
