import { env } from "../../env/client.mjs";

type Logtype = "log" | "info" | "warn" | "error";

/**
 * Logs information to the console
 * @param msg Message to log
 * @param type Type of log
 */
export default function Log(msg: unknown, type: Logtype = "log") {
  if (process.env.NODE_ENV !== "production" || env.NEXT_PUBLIC_DEBUG) {
    switch (type) {
      case "log":
        console.log(msg);
        break;
      case "info":
        console.info(msg);
        break;
      case "warn":
        console.warn(msg);
        break;
      case "error":
        console.error(msg);
        break;
    }
  }
}
