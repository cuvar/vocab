import type prisma from "@prisma/client";

export default class Tag implements prisma.Tag {
  id: string;
  name: string;
  description: string;

  constructor(id: string, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  static fromPrisma(tag: prisma.Tag): Tag {
    return new Tag(tag.id, tag.name, tag.description);
  }

  toPrisma(): prisma.Tag {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
    };
  }
}
