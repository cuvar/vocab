import { api } from "../utils/api";
import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { toastTextAtom, toastTypeAtom } from "../server/store";

export default function Generator() {
  const [wordToDisplay, setWordToDisplay] = useState<VocabularyWord | null>(
    null
  );
  const [_, setToastText] = useAtom(toastTextAtom);
  const [__, setToastType] = useAtom(toastTypeAtom);

  // const initDB = api.word.initDB.useMutation();
  const markAsLearned = api.word.markAsLearned.useMutation({
    onSuccess: (data) => {
      setToastType("success");
      setToastText(`${data.translation} marked as learned`);

      setTimeout(() => {
        setToastText("");
      }, 1500);
    },
    onError: (err) => {
      setToastType("error");
      setToastText(err.message);

      setTimeout(() => {
        setToastText("");
      }, 1500);
    },
  });
  const randomWord = api.word.getRandomUnlearnedWord.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!randomWord.data) {
      return;
    }

    setWordToDisplay({ ...randomWord.data });
  }, [randomWord.data]);

  function handleClick() {
    if (!randomWord.data?.translation) {
      setToastType("error");
      setToastText("no word, try refreshing.");
      setTimeout(() => {
        setToastText("");
      }, 1500);
      return;
    }

    markAsLearned.mutate({
      id: randomWord.data?.id,
      learned: true,
    });
  }

  return (
    <div className="my-20 mx-5 flex min-h-screen w-full flex-col items-center justify-start space-y-20">
      <div className="flex-col items-center space-y-2 text-center">
        {wordToDisplay == null ? (
          <p className="text-3xl text-error">No word available</p>
        ) : (
          <>
            <p className="text-3xl font-bold">{wordToDisplay.translation}</p>
            <p className="text-xl">{wordToDisplay.native}</p>
            <p className="text-xl">{wordToDisplay.notes}</p>
            {wordToDisplay.c1business && (
              <div className="text-md text-secondary">#Business</div>
            )}
          </>
        )}
      </div>

      <div className="flex space-x-4">
        <button
          className="btn-neutral btn-md btn text-xl"
          onClick={async () => {
            await randomWord.refetch();
          }}
        >
          Next
        </button>
        {randomWord.data?.translation != null && (
          <button
            className="btn-accent btn-outline btn-md btn text-xl"
            onClick={handleClick}
          >
            Choose
          </button>
        )}
      </div>
    </div>
  );
}
