import { isBoolean } from "../../../lib/guards/base";
import Tag from "../server/tag";

export type TagData = {
  id: string;
  name: string;
  description: string;
  checked: boolean;
};

/**
 *
 * @param data
 */
export function isTagData(data: unknown): data is TagData {
  if (!Tag.validate(data)) {
    return false;
  }
  if (!("checked" in data) || !isBoolean(data.checked)) {
    return false;
  }

  return true;
}

/**
 *
 * @param data
 */
export function isTagDataArray(data: unknown): data is TagData[] {
  return Array.isArray(data) && data.every((d) => isTagData(d));
}
