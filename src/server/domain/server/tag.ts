import type prisma from "@prisma/client";
import { isObject, isString } from "~/lib/guards/base";

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

  static validate(data: unknown): data is Tag {
    if (!isObject(data)) {
      return false;
    }
    if (!isString(data.id)) {
      return false;
    }
    if (!isString(data.name)) {
      return false;
    }
    if (!isString(data.description)) {
      return false;
    }
    return true;
  }

  static validateArray(data: unknown): data is Tag[] {
    return Array.isArray(data) && data.every((d) => Tag.validate(d));
  }
}
