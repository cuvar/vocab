import { type FECollection } from "~/server/domain/client/feCollection";
import { parseCollections } from "~/server/service/client/parseCache.service";
import { KEY_COLLECTIONS } from "./keys";

/**
 * Sets the collections in the localStorage
 * @param {FECollection[]} collections All collections the user has
 * @param collectionId
 * @param collections
 */
export function setAllCollections(collections: FECollection[]) {
  localStorage.setItem(KEY_COLLECTIONS, JSON.stringify(collections));
}

/**
 * Returns all collections the user has
 * @param collectionId
 * @returns {FECollection[]} All stored collections the user has
 */
export function getAllCollections(): FECollection[] {
  const res = localStorage.getItem(KEY_COLLECTIONS);
  if (!res) {
    return [];
  }

  return parseCollections(res);
}
