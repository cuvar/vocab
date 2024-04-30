import AppError from "../../lib/error/error";
import { db } from "../db";
import Tag from "../domain/server/tag";
import { type TagRepository } from "./TagRepository";

export class TagSupabaseRepository implements TagRepository {
  getTags = async (collectionId: string) => {
    try {
      const data = await db.tag.findMany({
        where: {
          collectionId: collectionId,
        },
      });
      const tags = data.map((e) => Tag.fromPrisma(e));
      return tags;
    } catch (error) {
      throw new AppError("Cannot get tags", error);
    }
  };

  getTag = async (tagName: string) => {
    try {
      const data = await db.tag.findUnique({
        where: {
          name: tagName,
        },
      });

      if (!data) {
        throw new AppError("Cannot find tag " + tagName);
      }

      return Tag.fromPrisma(data);
    } catch (error) {
      throw new AppError("Cannot get tag with name '" + tagName + "'", error);
    }
  };

  getTagsForWord = async (wordId: string) => {
    try {
      const data = await db.word.findUnique({
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
      throw new AppError("Cannot get tags for word with id " + wordId, error);
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
      await db.wordTags.deleteMany({
        where: {
          wordId: wordId,
        },
      });

      const createRes = await db.wordTags.createMany({
        data: createData,
      });

      if (!createRes) {
        throw new AppError("Cannot set tags for word with id " + wordId);
      }

      return createRes.count;
    } catch (error) {
      throw new AppError("Cannot set tags for word with id " + wordId, error);
    }
  };

  updateTag = async (tagId: string, name: string, description: string) => {
    try {
      const data = await db.tag.update({
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
      throw new AppError("Cannot update tag with id " + tagId, error);
    }
  };

  addTag = async (name: string, description: string, collectionId: string) => {
    try {
      const data = await db.tag.create({
        data: {
          name: name,
          description: description,
          collectionId: collectionId,
        },
      });

      return Tag.fromPrisma(data);
    } catch (error) {
      throw new AppError("Cannot add tag with name " + name, error);
    }
  };

  deleteTag = async (tagId: string) => {
    try {
      const data = await db.tag.delete({
        where: {
          id: tagId,
        },
      });

      return Tag.fromPrisma(data);
    } catch (error) {
      throw new AppError("Cannot delete tag with id " + tagId, error);
    }
  };
}
