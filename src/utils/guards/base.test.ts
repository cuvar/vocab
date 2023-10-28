/**
 * @jest-environment node
 */

import { isDate, isNumber, isObject, isString } from "./base";

describe("guards - base:", () => {
  it("isObject works correctly", () => {
    // arrange
    const input = {};
    // act
    const result = isObject(input);
    // assert
    expect(result).toBe(true);
  });

  it("isObject fails correctly", () => {
    // arrange
    const input = "lxx";
    // act
    const result = isObject(input);
    // assert
    expect(result).toBe(false);
  });

  it("isString works correctly", () => {
    // arrange
    const input = "helllo world";
    // act
    const result = isString(input);
    // assert
    expect(result).toBe(true);
  });

  it("isString fails correctly", () => {
    // arrange
    const input = 22;
    // act
    const result = isString(input);
    // assert
    expect(result).toBe(false);
  });

  it("isNumber works correctly", () => {
    // arrange
    const input = 123;
    // act
    const result = isNumber(input);
    // assert
    expect(result).toBe(true);
  });

  it("isNumber fails correctly", () => {
    // arrange
    const input = false;
    // act
    const result = isNumber(input);
    // assert
    expect(result).toBe(false);
  });

  it("isDate works correctly", () => {
    // arrange
    const input = new Date();
    // act
    const result = isDate(input);
    // assert
    expect(result).toBe(true);
  });

  it("isDate fails correctly", () => {
    // arrange
    const input = false;
    // act
    const result = isDate(input);
    // assert
    expect(result).toBe(false);
  });
});
