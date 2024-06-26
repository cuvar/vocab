import { LearnMode } from "@prisma/client";
import AppError from "../../../lib/error/error";
import {
  vocabularyWordToWord,
  type VocabularyWord,
} from "../../domain/client/vocabularyWord";
import { WOTDSupabaseRepository } from "../../repository/WOTDSupabaseRepository";
import { WordSupabaseRepository } from "../../repository/WordSupabaseRepository";
import { getTodayMorning } from "./getDate.service";

const wotdRepo = new WOTDSupabaseRepository();
const wordRepo = new WordSupabaseRepository();

const LAST_N = 100;

/**
 * Gets the word of the day that has not been learned yet
 * @param collectionId
 * @returns {Promise<WOTD>} Word of the day
 */
export async function getWOTD(collectionId: string) {
  try {
    const today = await wotdRepo.getToday(collectionId);
    if (today) {
      return today;
    }
    const newWord = await getNewWOTD(collectionId);
    return newWord;
  } catch (error) {
    throw new AppError("Cannot get word of the day", error);
  }
}

/**
 * Generates a new word of the day
 * @param collectionId
 * @returns {Promise<WOTD>} New word of the day
 */
async function getNewWOTD(collectionId: string) {
  try {
    const countLearned = await wordRepo.getCountByFilter({
      mode: LearnMode.LEARNED,
    });
    const last_n = Math.min(LAST_N, countLearned - 1);
    const lastNWords = await wotdRepo.getLastWords(last_n, collectionId);
    const learnedWords = await wordRepo.getWordsByFilter({
      mode: LearnMode.LEARNED,
    });
    const lastWordsIds = lastNWords.map((w) => w.word.id);

    if (learnedWords.length == 0) throw new AppError("No words left");

    let choice: VocabularyWord | null = null;
    let i = 0;
    while (choice == null && i < 150) {
      i++;
      const randomWord =
        learnedWords[Math.floor(Math.random() * learnedWords.length)];
      if (!randomWord) continue;
      if (lastWordsIds.includes(randomWord.id)) continue;
      choice = randomWord;
      break;
    }

    if (!choice) throw new AppError("No word of the day could be found.");
    const addedWord = await wotdRepo.add(
      vocabularyWordToWord(choice),
      getTodayMorning()
    );
    return addedWord;
  } catch (error) {
    throw new AppError("Cannot create new word of the day", error);
  }
}
