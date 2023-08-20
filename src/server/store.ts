import { atom } from "jotai";

export const toastTextAtom = atom("");
export const toastTypeAtom = atom<ToastType>("success");
export const editorVisibleAtom = atom(false);
export const addModalIdAtom = atom("addModal");
