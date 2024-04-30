import { LearnMode as PrismaLearnMode } from "@prisma/client";
import { type StrippedVocabularyWord } from "~/server/domain/client/strippedVocabularyWord";
import AppError from "../../../lib/error/error";
import { isJsonImportWordArray } from "../../domain/client/jsonImportWord";
import { WordSupabaseRepository } from "../../repository/WordSupabaseRepository";
import { searchWord } from "../client/search.service";

const repo = new WordSupabaseRepository();

/**
 *
 * @param text
 */
export async function importWords(text: string) {
  const parsed = JSON.parse(text) as string;
  if (!isJsonImportWordArray(parsed)) {
    throw new AppError("Input is in wrong format");
  }

  const res = await repo.importWords(parsed);
  return res;
}

/**
 *
 * @param id
 * @param translation
 * @param native
 * @param front
 * @param back
 * @param notes
 * @param mode
 * @param tagIds
 */
export async function updateWord(
  id: string,
  front: string,
  back: string,
  notes: string,
  mode: string,
  tagIds: string[]
) {
  const newWord: StrippedVocabularyWord = {
    front: front,
    back: back,
    notes: notes,
    mode: PrismaLearnMode.UNLEARNED,
    tags: [],
  };

  const res = await repo.updateWord(id, newWord);
  // TODO: what about mode nad tagIds?
  return res;
}

/**
 *
 * @param id
 */
export async function deleteWord(id: string) {
  const word = await repo.deleteWord(id);
  return word;
}

/**
 *
 * @param translation
 * @param native
 * @param front
 * @param back
 * @param notes
 * @param tagIds
 */
export async function addWord(
  front: string,
  back: string,
  notes: string,
  tagIds: string[]
) {
  // TODO: what about tagIds?
  const newWord: StrippedVocabularyWord = {
    front: front,
    back: back,
    notes: notes,
    mode: PrismaLearnMode.UNLEARNED,
    tags: [],
  };
  const res = await repo.addWord(newWord);
  return res;
}

/**
 *
 * @param id
 * @param mode
 */
export async function updateMode(id: string, mode: PrismaLearnMode) {
  const res = await repo.updateMode(id, mode);
  return res;
}

/**
 *
 */
export async function getRandomUnlearnedWord() {
  const unlearned = await repo.getWordsByFilter({
    mode: PrismaLearnMode.UNLEARNED,
  });
  const randomWord = unlearned[Math.floor(Math.random() * unlearned.length)];
  return randomWord;
}

/**
 *
 */
export async function getCountUnlearnedWords() {
  const res = await repo.getCountByFilter({
    mode: PrismaLearnMode.UNLEARNED,
  });
  return res;
}

/**
 *
 * @param word
 */
export async function searchInWords(word: string) {
  const res = await repo.getWords();
  return searchWord(res, word);
}

/**
 *
 */
export async function getArchived() {
  const words = await repo.getWordsByFilter({
    mode: PrismaLearnMode.ARCHIVED,
  });
  return words;
}

/**
 *
 */
export async function getLearned() {
  const words = await repo.getWordsByFilter({
    mode: PrismaLearnMode.LEARNED,
  });
  return words;
}

/**
 *
 * @param word
 */
export async function getWord(word: string) {
  const res = await repo.getWord(word);
  return res;
}

/**
 *
 * @param collectionId
 */
export async function getWordsForCollection(collectionId: string) {
  const words = await repo.getWordsForCollection(collectionId);
  return words;
}
