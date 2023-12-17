import { LearnMode } from "@prisma/client";
import { WOTDSupabaseRepository } from "../server/repository/WOTDSupabaseRepository";
import { WordSupabaseRepository } from "../server/repository/WordSupabaseRepository";
import type { VocabularyWord } from "../types/types";

const wotdRepo = new WOTDSupabaseRepository();
const wordRepo = new WordSupabaseRepository();

const LAST_N = 100;

/**
 * Gets the word of the day that has not been learned yet
 * @returns {Promise<VocabularyWord>} Word of the day
 */
export async function getWOTD() {
  try {
    const today = await wotdRepo.getLastWords(LAST_N);
    if (today) {
      return today;
    }
    const newWord = await getNewWOTD();
    return newWord;
  } catch (error) {
    console.log(error);
    throw new Error("Cannot get word of the day");
  }
}

/**
 * Generates a new word of the day
 * @returns {Promise<VocabularyWord>} New word of the day
 */
async function getNewWOTD() {
  try {
    const lastNWords = await wotdRepo.getLastWords(LAST_N);
    const unlearned = await wordRepo.getWordsByFilter({
      mode: LearnMode.UNLEARNED,
    });
    const lastWordsIds = lastNWords.map((w) => w.word.id);

    if (unlearned.length == 0) throw new Error("No words left");

    let choice: VocabularyWord | null = null;
    let i = 0;
    while (choice == null && i < 150) {
      i++;
      const randomWord =
        unlearned[Math.floor(Math.random() * unlearned.length)];
      if (!randomWord) continue;
      if (lastWordsIds.includes(randomWord.id)) continue;
      choice = randomWord;
      break;
    }

    if (!choice) throw new Error("No word of the day could be found.");
    await wotdRepo.add(choice, new Date());
    return choice;
  } catch (error) {
    throw new Error("Cannot create new word of the day");
  }
}
