import { atom } from "jotai";
import { type ToastType, type VocabularyWord } from "../types/types";

export const toastTextAtom = atom("");
export const toastTypeAtom = atom<ToastType>("success");
export const editorVisibleAtom = atom(false);
export const modalIdAtom = atom("modalId");
export const showModalAtom = atom(false);
export const wordToEditAtom = atom<VocabularyWord | null>(null);
export const refetchWordsAtom = atom<boolean>(false);
