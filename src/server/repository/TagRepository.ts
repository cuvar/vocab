import { type Tag } from "../../types/types";

export interface TagRepository {
  getTags: () => Promise<Tag[]>;
  getTag: (tagName: string) => Promise<Tag>;
  getTagsForWord: (word: string) => Promise<Tag[]>;
  setTagsForWord: (wordId: string, tagIds: string[]) => Promise<number>;
}
