/**
 * Checks whether data is of type Record<string, string>
 * @param {unknown} data Unkown type to be checked
 * @returns {boolean} Whether data is of type Record<string, string>
 */
export function isObject(data: unknown): data is Record<string, string> {
  return typeof data === "object" && data !== null;
}

/**
 * Checks whether data is of type string
 * @param {unknown} data Unkown type to be checked
 * @returns {boolean} Whether data is of type string
 */
export function isString(data: unknown): data is string {
  return typeof data === "string";
}

/**
 * Checks whether data is of type number
 * @param {unknown} data Unkown type to be checked
 * @returns {boolean} Whether data is of type number
 */
export function isNumber(data: unknown): data is number {
  return typeof data === "number";
}

/**
 * Checks whether data is of type Date
 * @param {unknown} data Unkown type to be checked
 * @returns {boolean} Whether data is of type Date
 */
export function isDate(data: unknown): data is Date {
  return data instanceof Date;
}

/**
 * Checks whether data is of type Boolean
 * @param {unknown} data Unkown type to be checked
 * @returns {boolean} Whether data is of type Boolean
 */
export function isBoolean(data: unknown): data is Date {
  return typeof data === "boolean";
}
