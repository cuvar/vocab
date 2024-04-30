import type Tag from "../domain/server/tag";

export interface TagRepository {
  getTags: (collectionId: string) => Promise<Tag[]>;
  getTag: (tagName: string) => Promise<Tag>;
  getTagsForWord: (word: string) => Promise<Tag[]>;
  setTagsForWord: (wordId: string, tagIds: string[]) => Promise<number>;
  updateTag: (
    tagId: string,
    name: string,
    description: string,
    collectionId: string
  ) => Promise<Tag>;
  addTag: (
    name: string,
    description: string,
    collectionId: string
  ) => Promise<Tag>;
  deleteTag: (tagId: string) => Promise<Tag>;
}
