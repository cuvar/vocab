import { LearnMode as PrismaLearnMode } from "@prisma/client";
import { isString } from "~/lib/guards/base";

export default class LearnMode {
  value: PrismaLearnMode;

  constructor(value: PrismaLearnMode) {
    this.value = value;
  }

  static fromPrisma(prisma: PrismaLearnMode): LearnMode {
    return new LearnMode(prisma);
  }

  toPrisma(): PrismaLearnMode {
    return this.value;
  }

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

export const LEARN_MODES = Object.entries(PrismaLearnMode).map(([, v]) => v);
