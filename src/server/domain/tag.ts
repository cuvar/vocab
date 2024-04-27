import type prisma from "@prisma/client";

export default class Tag implements prisma.Tag {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    description: string,
    createdAt: Date | null,
    updatedAt: Date | null
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
  }

  static fromPrisma(tag: prisma.Tag): Tag {
    return new Tag(
      tag.id,
      tag.name,
      tag.description,
      tag.createdAt,
      tag.updatedAt
    );
  }

  toPrisma(): prisma.Tag {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
