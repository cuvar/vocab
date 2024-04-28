import type TagData from "~/server/domain/client/tagData";
import { TagSupabaseRepository } from "~/server/repository/TagSupabaseRepository";

const repo = new TagSupabaseRepository();

/**
 *
 */
export async function getTags() {
  const tags = await repo.getTags();
  return tags;
}

/**
 *
 * @param wordId
 */
export async function getTagsForWord(wordId: string) {
  const allTags = await repo.getTags();
  const tagsForWord = await repo.getTagsForWord(wordId);

  const combinedTags: TagData[] = allTags.map((t) => {
    const index = tagsForWord.findIndex((e) => e.id === t.id);
    return {
      ...t,
      checked: index >= 0,
    };
  });

  return combinedTags;
}
/**
 *
 * @param id
 * @param name
 * @param description
 */
export async function updateTag(id: string, name: string, description: string) {
  const updatedTag = await repo.updateTag(id, name, description);
  return updatedTag;
}

/**
 *
 * @param name
 * @param description
 */
export async function addTag(name: string, description: string) {
  const addedTag = await repo.addTag(name, description);
  return addedTag;
}

/**
 *
 * @param name
 * @param description
 * @param id
 */
export async function deleteTag(id: string) {
  const deletedTag = await repo.deleteTag(id);
  return deletedTag;
}
