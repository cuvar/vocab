import { type Tag } from "../../types/types";

export interface TagRepository {
  getTags: () => Promise<Tag[]>;
  getTag: (tagName: string) => Promise<Tag>;
  getTagsForWord: (word: string) => Promise<Tag[]>;
  setTagsForWord: (wordId: string, tagIds: string[]) => Promise<number>;
  updateTag: (tagId: string, name: string, description: string) => Promise<Tag>;
  addTag: (name: string, description: string) => Promise<Tag>;
  deleteTag: (tagId: string) => Promise<Tag>;
}
