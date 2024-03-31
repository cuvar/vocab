import { useAtom } from "jotai";
import { toastTextAtom, toastTypeAtom } from "../server/store";
import { type ToastType } from "../types/types";

/**
 * Hook for displaying a toast if the toast is available on the UI
 * @returns {Function} Function for displaying a toast
 */
export function useToast() {
  const [, setToastText] = useAtom(toastTextAtom);
  const [, setToastType] = useAtom(toastTypeAtom);

  /**
   *
   * @param code
   * @param text
   * @param type
   * @param delay
   */
  function showToast(text: string, type: ToastType, delay = 1500) {
    setToastType(type);
    setToastText(text);
    setTimeout(() => {
      setToastText("");
    }, delay);
  }
  return showToast;
}
