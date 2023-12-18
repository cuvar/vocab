import { LearnMode } from "@prisma/client";
import { WOTDSupabaseRepository } from "../server/repository/WOTDSupabaseRepository";
import { WordSupabaseRepository } from "../server/repository/WordSupabaseRepository";
import type { VocabularyWord, WOTD } from "../types/types";
import { getTodayMorning } from "./getDate.service";
import AppError from "../utils/error";
import Log from "../utils/log";

const wotdRepo = new WOTDSupabaseRepository();
const wordRepo = new WordSupabaseRepository();

const LAST_N = 100;

/**
 * Gets the word of the day that has not been learned yet
 * @returns {Promise<WOTD>} Word of the day
 */
export async function getWOTD() {
  try {
    const today = await wotdRepo.getToday();
    if (today) {
      return today;
    }
    const newWord = await getNewWOTD();
    return newWord;
  } catch (error) {
    Log(error);
    throw new AppError("Cannot get word of the day", error);
  }
}

/**
 * Generates a new word of the day
 * @returns {Promise<WOTD>} New word of the day
 */
async function getNewWOTD() {
  try {
    const lastNWords = await wotdRepo.getLastWords(LAST_N);
    const unlearned = await wordRepo.getWordsByFilter({
      mode: LearnMode.UNLEARNED,
    });
    const lastWordsIds = lastNWords.map((w) => w.word.id);

    if (unlearned.length == 0) throw new AppError("No words left");

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

    if (!choice) throw new AppError("No word of the day could be found.");
    const addedWord = await wotdRepo.add(choice, getTodayMorning());
    return addedWord;
  } catch (error) {
    throw new AppError("Cannot create new word of the day");
  }
}
