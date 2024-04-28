import AppError from "../../lib/error/error";
import { db } from "../db";
import Collection from "../domain/server/collection";
import { type CollectionRepository } from "./CollectionRepository";

export class CollectionSupabaseRepository implements CollectionRepository {
  getCollections = async () => {
    try {
      const data = await db.collection.findMany();
      const collections = data.map((e) => Collection.fromPrisma(e));
      return collections;
    } catch (error) {
      throw new AppError("Cannot get collections", error);
    }
  };

  updateCollection = async (
    collectionId: string,
    name: string,
    description: string
  ) => {
    try {
      const data = await db.collection.update({
        where: {
          id: collectionId,
        },
        data: {
          name: name,
          description: description,
        },
      });

      return Collection.fromPrisma(data);
    } catch (error) {
      throw new AppError(
        "Cannot update collection with id " + collectionId,
        error
      );
    }
  };

  addCollection = async (name: string, description: string) => {
    try {
      const data = await db.collection.create({
        data: {
          name: name,
          description: description,
        },
      });

      return Collection.fromPrisma(data);
    } catch (error) {
      throw new AppError("Cannot add collection with name " + name, error);
    }
  };

  deleteCollection = async (collectionId: string) => {
    try {
      const data = await db.collection.delete({
        where: {
          id: collectionId,
        },
      });

      return Collection.fromPrisma(data);
    } catch (error) {
      throw new AppError(
        "Cannot delete collection with id " + collectionId,
        error
      );
    }
  };
}
