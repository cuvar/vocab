import { LearnMode } from "@prisma/client";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useToast } from "../../lib/ui/hooks";
import { type VocabularyWord } from "../../server/domain/client/vocabularyWord";

type Props = {
  collectionId: string;
};

export default function Generator(props: Props) {
  const [wordToDisplay, setWordToDisplay] = useState<VocabularyWord | null>(
    null
  );
  const showToast = useToast();
  // const initDB = api.word.initDB.useMutation();
  const updateModeMutation = api.word.updateMode.useMutation({
    onSuccess: (data) =>
      showToast(`${data.front} marked as learned`, "success"),
    onError: (err) => showToast(`${err.message}`, "error"),
  });

  const randomWord = api.word.getRandomUnlearnedWord.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!randomWord.data) {
      return;
    }
    setWordToDisplay({
      id: "",
      front: randomWord.data.front,
      back: randomWord.data.back,
      notes: randomWord.data.notes,
      mode: randomWord.data.mode,
      iconFront: randomWord.data.iconFront,
      iconBack: randomWord.data.iconBack,
      tags: randomWord.data.tags,
    } as VocabularyWord);
  }, [randomWord.data]);

  function handleClick() {
    if (!randomWord.data?.front) {
      showToast("no word, try refreshing.", "error");
      return;
    }

    updateModeMutation.mutate({
      id: randomWord.data?.id,
      mode: LearnMode.LEARNED,
    });
  }

  function handleNextClick() {
    void (async () => {
      await randomWord.refetch();
    })();
  }

  return (
    <div className="my-20 mx-5 flex min-h-screen w-full flex-col items-center justify-start space-y-20">
      <div className="flex-col items-center space-y-2 text-center">
        {wordToDisplay == null ? (
          randomWord.error ? (
            <p className="text-3xl text-error">No word available</p>
          ) : (
            <p className="text-3xl italic">Loading...</p>
          )
        ) : (
          <div className="flex h-60 w-full flex-col justify-center">
            <p className="text-3xl font-bold">{wordToDisplay.front}</p>
            <p className="text-xl">{wordToDisplay.back}</p>
            <p className="text-xl">{wordToDisplay.notes}</p>
            {wordToDisplay.tags.length > 0 && (
              <p className="text-md">
                {wordToDisplay.tags.map((e) => e.name).join(" ")}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        <button
          className="btn-neutral btn-md btn text-xl"
          onClick={handleNextClick}
        >
          Next
        </button>
        {randomWord.data?.front != null && (
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
