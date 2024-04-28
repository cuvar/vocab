import { type Collection } from "@prisma/client";

export interface CollectionRepository {
  getCollections: () => Promise<Collection[]>;
  updateCollection: (
    collectionId: string,
    name: string,
    description: string
  ) => Promise<Collection>;
  addCollection: (name: string, description: string) => Promise<Collection>;
  deleteCollection: (collectionId: string) => Promise<Collection>;
}
