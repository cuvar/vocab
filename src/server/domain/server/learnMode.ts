import { type LearnMode as PrismaLearnMode } from "@prisma/client";
import { isString } from "../../../lib/guards/base";

export class LearnMode {
  static validate(data: unknown): data is PrismaLearnMode {
    if (!isString(data)) {
      return false;
    }

    if (data !== "UNLEARNED" && data !== "LEARNED" && data !== "ARCHIVED") {
      return false;
    }

    return true;
  }
}
