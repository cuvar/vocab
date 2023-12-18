import { LearnMode } from "@prisma/client";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { toastTextAtom, toastTypeAtom } from "../server/store";
import { sendServiceWorkerWordOfTheDay } from "../service/serviceWorker.service";
import type { VocabularyWord } from "../types/types";
import { api } from "../utils/api";

export default function WordOfTheDay() {
  const [wordToDisplay, setWordToDisplay] = useState<VocabularyWord | null>(
    null
  );
  const [, setToastText] = useAtom(toastTextAtom);
  const [, setToastType] = useAtom(toastTypeAtom);

  const wotdQuery = api.word.getWordOfTheDay.useQuery(undefined, {
    refetchOnWindowFocus: false,
    onError: (err) => {
      setToastType("error");
      setToastText(err.message);
      setTimeout(() => {
        setToastText("");
      }, 1500);
    },
  });

  const updateModeMutation = api.word.updateMode.useMutation({
    onSuccess: (data) => {
      setToastType("success");
      setToastText(`"${data.translation}" successfully added`);
      void (async () => {
        await wotdQuery.refetch();
      })();
      setTimeout(() => {
        setToastText("");
      }, 1500);
    },
    onError: (err) => {
      setToastType("error");
      setToastText(`${err.message}`);
      setTimeout(() => {
        setToastText("");
      }, 1500);
    },
  });

  useEffect(() => {
    if (!wotdQuery.data) {
      return;
    }

    setWordToDisplay(wotdQuery.data.word);
  }, [wotdQuery.data]);

  function handleNotify() {
    if (!wotdQuery.data) return;
    sendServiceWorkerWordOfTheDay(wotdQuery.data);
  }

  function handleMarkAsLearned() {
    updateModeMutation.mutate({
      id: wotdQuery.data?.word.id ?? "",
      mode: LearnMode.LEARNED,
    });
  }

  return (
    <div className="my-20 mx-5 flex min-h-screen w-full flex-col items-center justify-start space-y-20">
      <div className="flex-col items-center space-y-2 text-center">
        {wordToDisplay == null ? (
          wotdQuery.error ? (
            <p className="text-3xl text-error">No word of the day available</p>
          ) : (
            <p className="text-3xl italic">Loading...</p>
          )
        ) : (
          <div className="flex h-60 w-full flex-col justify-center">
            <h2 className="mb-20 text-2xl">Your Word of the day</h2>
            <p className="text-3xl font-bold">{wordToDisplay.translation}</p>
            <p className="text-xl">{wordToDisplay.native}</p>
            <p className="text-xl">{wordToDisplay.notes}</p>
            {wordToDisplay.tags.length > 0 && (
              <p className="text-md">
                {wordToDisplay.tags.map((e) => e.name).join(" ")}
              </p>
            )}
          </div>
        )}
        <div className="space-x-4">
          <button className="btn-ghost btn" onClick={handleNotify}>
            send
          </button>
          <button
            className="btn-secondary btn"
            onClick={handleMarkAsLearned}
            disabled={wotdQuery.data?.word.mode !== LearnMode.UNLEARNED}
          >
            Mark as learned
          </button>
        </div>
      </div>
    </div>
  );
}
