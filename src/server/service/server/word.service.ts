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
 * @param collectionId
 */
export async function importWords(text: string, collectionId: string) {
  const parsed = JSON.parse(text) as string;
  if (!isJsonImportWordArray(parsed)) {
    throw new AppError("Input is in wrong format");
  }
  const res = await repo.importWords(parsed, collectionId);
  return res;
}

/**
 *
 * @param id
 * @param front
 * @param back
 * @param front
 * @param back
 * @param notes
 * @param collectionId
 * @param mode
 * @param tagIds
 */
export async function updateWord(
  id: string,
  front: string,
  back: string,
  notes: string,
  collectionId: string,
  mode: string,
  tagIds: string[]
) {
  const newWord: StrippedVocabularyWord = {
    front: front,
    back: back,
    notes: notes,
    mode: PrismaLearnMode.UNLEARNED,
    collectionId: collectionId,
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
 * @param front
 * @param back
 * @param front
 * @param back
 * @param notes
 * @param collectionId
 * @param tagIds
 */
export async function addWord(
  front: string,
  back: string,
  notes: string,
  collectionId: string,
  tagIds: string[]
) {
  // TODO: what about tagIds?
  const newWord: StrippedVocabularyWord = {
    front: front,
    back: back,
    notes: notes,
    mode: PrismaLearnMode.UNLEARNED,
    collectionId: collectionId,
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
 * @param collectionId
 */
export async function getRandomUnlearnedWord(collectionId: string) {
  const unlearned = await repo.getWordsByFilter({
    mode: PrismaLearnMode.UNLEARNED,
    collectionId: collectionId,
  });
  const randomWord = unlearned[Math.floor(Math.random() * unlearned.length)];
  return randomWord;
}

/**
 *
 * @param collectionId
 */
export async function getCountUnlearnedWords(collectionId: string) {
  const res = await repo.getCountByFilter({
    mode: PrismaLearnMode.UNLEARNED,
    collectionId: collectionId,
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
 * @param collectionId
 */
export async function getArchived(collectionId: string) {
  const words = await repo.getWordsByFilter({
    mode: PrismaLearnMode.ARCHIVED,
    collectionId: collectionId,
  });
  return words;
}

/**
 *
 * @param collectionId
 */
export async function getLearned(collectionId: string) {
  const words = await repo.getWordsByFilter({
    mode: PrismaLearnMode.LEARNED,
    collectionId: collectionId,
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
