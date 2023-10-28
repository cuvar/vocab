import { type Tag } from "../../types/types";
import { prisma } from "../db";
import { type TagRepository } from "./TagRepository";

export class TagSupabaseRepository implements TagRepository {
  getTags = async () => {
    const data = await prisma.tag.findMany();
    const tags = data.map((e) => {
      return {
        id: e.id,
        name: e.name,
        description: e.description,
      } satisfies Tag;
    });
    return tags;
  };

  getTag = async (tagName: string) => {
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
  };

  getTagsForWord = async (wordId: string) => {
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
  };
}
