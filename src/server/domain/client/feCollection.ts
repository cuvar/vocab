import { isNumber, isObject, isString } from "../../../lib/guards/base";

export type FECollection = {
  id: string;
  name: string;
  description: string;
  count: number;
};

/**
 *
 * @param data
 */
export function isFECollection(data: unknown): data is FECollection {
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
  if (!isNumber(data.count)) {
    return false;
  }
  return true;
}
