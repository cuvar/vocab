import { type Tag as PrismaTag } from "@prisma/client";
import { isBoolean } from "../../../lib/guards/base";
import Tag from "../server/tag";

export default class TagData implements PrismaTag {
  id: string;
  name: string;
  description: string;
  checked: boolean;

  constructor(id: string, name: string, description: string, checked: boolean) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.checked = checked;
  }

  static validate(data: unknown): data is TagData {
    if (!Tag.validate(data)) {
      return false;
    }
    if (!("checked" in data) || !isBoolean(data.checked)) {
      return false;
    }

    return true;
  }

  static validateArray(data: unknown): data is TagData[] {
    return Array.isArray(data) && data.every((d) => TagData.validate(d));
  }
}
