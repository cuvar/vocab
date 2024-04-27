import { LearnMode as PrismaLearnMode } from "@prisma/client";

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
}

export const LEARN_MODES = Object.entries(PrismaLearnMode).map(([, v]) => v);
