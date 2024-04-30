import { type FECollection } from "~/server/domain/client/feCollection";
import { CollectionSupabaseRepository } from "~/server/repository/CollectionSupabaseRepository";

const repo = new CollectionSupabaseRepository();

/**
 *
 * @param id
 * @param name
 * @param description
 */
export async function updateCollection(
  id: string,
  name: string,
  description: string
) {
  const collection = await repo.updateCollection(id, name, description);
  return collection;
}

/**
 *
 * @param id
 */
export async function deleteCollection(id: string) {
  const collection = await repo.deleteCollection(id);
  return collection;
}

/**
 *
 * @param translation
 * @param native
 * @param front
 * @param back
 * @param notes
 * @param tagIds
 * @param name
 * @param description
 */
export async function addCollection(name: string, description: string) {
  const collection = await repo.addCollection(name, description);
  return collection;
}

/**
 *
 */
export async function getAllCollections() {
  const collections = await repo.getCollections();
  const mapped = collections.map((c) => {
    return {
      id: c.collection.id,
      name: c.collection.name,
      description: c.collection.description ?? "",
      count: c.count,
    } satisfies FECollection;
  });
  return mapped;
}
