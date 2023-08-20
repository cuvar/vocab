import { atom } from "jotai";

export const toastTextAtom = atom("");
export const toastTypeAtom = atom<ToastType>("success");
