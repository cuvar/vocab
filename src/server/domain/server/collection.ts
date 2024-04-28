import type prisma from "@prisma/client";

export default class Collection implements prisma.Collection {
  id: string;
  name: string;
  description: string | null;

  constructor(id: string, name: string, description: string | null) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  static fromPrisma(collection: prisma.Collection): Collection {
    return new Collection(
      collection.id,
      collection.name,
      collection.description ?? null
    );
  }

  toPrisma(): prisma.Collection {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
    };
  }
}
