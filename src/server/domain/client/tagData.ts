import { isBoolean } from "../../../lib/guards/base";
import Tag from "../server/tag";

export type TagDataData = {
  id: string;
  name: string;
  description: string;
  checked: boolean;
};

export default class TagData {
  static validate(data: unknown): data is TagDataData {
    if (!Tag.validate(data)) {
      return false;
    }
    if (!("checked" in data) || !isBoolean(data.checked)) {
      return false;
    }

    return true;
  }

  static validateArray(data: unknown): data is TagDataData[] {
    return Array.isArray(data) && data.every((d) => TagData.validate(d));
  }
}
