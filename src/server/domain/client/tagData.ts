import { type Tag } from "@prisma/client";

export default class TagData implements Tag {
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
}
