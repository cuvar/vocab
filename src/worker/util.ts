import Log from "../utils/log";

/**
 * Tests es6+ syntax
 */
export function util() {
  Log("Hello from util.");
  Log("es6+ syntax test:");
  const foo = { message: "working" };
  Log(foo?.message);
}
