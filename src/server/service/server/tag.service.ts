import { type TagData } from "../../domain/client/tagData";
import { TagSupabaseRepository } from "../../repository/TagSupabaseRepository";

const repo = new TagSupabaseRepository();

/**
 *
 * @param collectionId
 */
export async function getTags(collectionId: string) {
  const tags = await repo.getTags(collectionId);
  return tags;
}

/**
 *
 * @param wordId
 * @param collectionId
 */
export async function getTagsForWord(wordId: string, collectionId: string) {
  const allTags = await repo.getTags(collectionId);
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
 * @param collectionId
 */
export async function addTag(
  name: string,
  description: string,
  collectionId: string
) {
  const addedTag = await repo.addTag(name, description, collectionId);
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
