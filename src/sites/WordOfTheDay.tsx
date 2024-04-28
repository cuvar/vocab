import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { DEFAULT_SETTINGS } from "../lib/const";
import { useToast } from "../lib/ui/hooks";
import { getSettings } from "../lib/ui/store/settings";
import type VocabularyWord from "../server/domain/client/vocabularyWord";
import { sendServiceWorkerWordOfTheDay } from "../lib/pwa/serviceWorker.service";

export default function WordOfTheDay() {
  const [wordToDisplay, setWordToDisplay] = useState<VocabularyWord | null>(
    null
  );

  const showToast = useToast();

  const REMINDER_TIME =
    getSettings()?.reminderTime ?? DEFAULT_SETTINGS.reminderTime;

  const wotdQuery = api.word.getWordOfTheDay.useQuery(undefined, {
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      try {
        sendServiceWorkerWordOfTheDay(data, REMINDER_TIME);
      } catch (error: unknown) {
        console.error(error);
      }
    },
    onError: (err) => showToast(`${err.message}`, "error"),
  });

  useEffect(() => {
    if (!wotdQuery.data) {
      return;
    }

    setWordToDisplay(wotdQuery.data.word);
  }, [wotdQuery.data]);

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
            <h1 className="mb-20 text-2xl tracking-tight">
              Your Word of the Day
            </h1>
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
      </div>
    </div>
  );
}
