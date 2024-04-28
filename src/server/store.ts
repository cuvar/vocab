import { atom } from "jotai";
import { type ToastType } from "../types/types";
import type VocabularyWord from "./domain/client/vocabularyWord";

// Toast
export const toastTextAtom = atom("");
export const toastTypeAtom = atom<ToastType>("success");

// Editor Modal
export const editorModalIdAtom = atom("editorModalId");
export const showEditorModalAtom = atom(false);
export const wordToEditAtom = atom<VocabularyWord | null>(null);

// Message Modal
export const messageModalIdAtom = atom("messageModalId");
export const showMessageModalAtom = atom(false);
export const tagToDeleteAtom = atom<string | null>(null);
export const deleteTagConfirmedAtom = atom<boolean>(false);

// other
export const refetchWordsAtom = atom<boolean>(false);
