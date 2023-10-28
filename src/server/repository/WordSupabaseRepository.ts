import { prisma } from "../db";
import { WordRepository } from "./WordRepository";

export class WordSupabaseRepository implements WordRepository {
  getWords = async () => {
    try {
      const data = await prisma.word.findMany();
      const transformed = data.map((e) => {
        return {
          ...e,
          iconNative: "🇩🇪",
          iconTranslation: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        };
      });
      return transformed as VocabularyWord[];
    } catch (error) {
      throw error;
    }
  };
  getWord = async (word: string) => {
    const data = await prisma.word.findUnique({
      where: {
        translation: word,
      },
    });

    if (data == null) {
      throw new Error("Word not found");
    }

    return {
      ...data,
      iconNative: "🇩🇪",
      iconTranslation: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    };
  };
  getWordsByFilter = async (word: string, filter: any) => {
    const filtered = await prisma.word.findMany({
      where: {
        ...filter,
      },
    });

    if (filtered == null) {
      throw new Error("Word not found");
    }

    const transformed = filtered.map((e) => {
      return {
        ...e,
        iconNative: "🇩🇪",
        iconTranslation: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      };
    });
    return transformed as VocabularyWord[];
  };
  getCountByFilter = async (filter: any) => {
    const count = await prisma.word.count({
      where: {
        ...filter,
      },
    });
    return count;
  };
  updateWord = async (id: string, newWord: FEWord) => {
    try {
      await prisma.word.update({
        where: {
          id: id,
        },
        data: {
          translation: newWord.translation,
          native: newWord.native,
          notes: newWord.notes,
          c1business: newWord.c1business,
          learned: newWord.learned,
        },
      });
    } catch (error) {
      throw error;
    }
  };
  deleteWord = async (id: string) => {
    try {
      await prisma.word.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  };
  addWord = async (word: FEWord) => {
    if (word.translation === "" || word.native === "") {
      throw new Error("Word cannot be empty");
    }
    if (word.translation.length > 100 || word.native.length > 100) {
      throw new Error("Word too long");
    }
    try {
      await prisma.word.create({
        data: {
          translation: word.translation,
          native: word.native,
          notes: word.notes,
          c1business: word.c1business,
          learned: false,
        },
      });
    } catch (error) {
      throw error;
    }
  };
  updateLearned = async (id: string, learned: boolean) => {
    try {
      const word = await prisma.word.findUnique({
        where: {
          id: id,
        },
      });

      if (!word) {
        throw new Error("Word not found");
      }

      await prisma.word.update({
        where: {
          translation: word.translation,
        },
        data: {
          learned: learned,
        },
      });
    } catch (error) {
      throw error;
    }
  };
}
